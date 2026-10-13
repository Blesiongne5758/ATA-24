import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { APIKey, AuditLog, EncryptedCredential } from '../database/models';
import { authService } from '../utils/auth';
import { encryptionService } from '../utils/encryption';
import { validateRequest, authenticate, apiKeyRateLimiter } from '../middleware/security';
import { auditLogger } from '../utils/logger';

const router = Router();

// Validation schemas
const generateKeySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  platform: Joi.string().required(),
  durationDays: Joi.number().integer().min(1).max(365).default(30),
});

const storeCredentialSchema = Joi.object({
  type: Joi.string().valid('mt5', 'exchange', 'api').required(),
  name: Joi.string().min(1).max(100).required(),
  data: Joi.object().required(),
});

/**
 * POST /api/keys/generate
 * Generate new API key
 */
router.post('/generate', authenticate, validateRequest(generateKeySchema), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, platform, durationDays } = req.body;

    // Generate API key
    const apiKey = authService.generateAPIKey();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Store API key
    const keyRecord = await APIKey.create({
      userId: user.userId,
      key: apiKey,
      name,
      platform,
      expiresAt,
    });

    // Log audit
    await AuditLog.create({
      userId: user.userId,
      action: 'API_KEY_GENERATE',
      resource: 'api_key',
      resourceId: keyRecord.id,
      details: { name, platform, durationDays },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('API key generated', {
      userId: user.userId,
      keyId: keyRecord.id,
      platform,
      ip: req.ip,
    });

    res.status(201).json({
      message: 'API key generated successfully',
      apiKey: {
        id: keyRecord.id,
        key: apiKey,
        name: keyRecord.name,
        platform: keyRecord.platform,
        expiresAt: keyRecord.expiresAt,
      },
    });
  } catch (error) {
    auditLogger.error('API key generation error', { error: (error as Error).message, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate API key',
    });
  }
});

/**
 * GET /api/keys
 * Get all API keys for current user
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const apiKeys = await APIKey.findAll({
      where: { userId: user.userId },
      attributes: ['id', 'key', 'name', 'platform', 'expiresAt', 'isActive', 'lastUsed', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    // Mask API keys for security
    const maskedKeys = apiKeys.map(key => ({
      ...key.toJSON(),
      key: encryptionService.mask(key.key, 10),
    }));

    res.json({ apiKeys: maskedKeys });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get API keys',
    });
  }
});

/**
 * GET /api/keys/:id
 * Get specific API key
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const apiKey = await APIKey.findOne({
      where: { id, userId: user.userId },
    });

    if (!apiKey) {
      return res.status(404).json({
        error: 'Not found',
        message: 'API key not found',
      });
    }

    res.json({
      apiKey: {
        ...apiKey.toJSON(),
        key: encryptionService.mask(apiKey.key, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get API key',
    });
  }
});

/**
 * DELETE /api/keys/:id
 * Revoke API key
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const apiKey = await APIKey.findOne({
      where: { id, userId: user.userId },
    });

    if (!apiKey) {
      return res.status(404).json({
        error: 'Not found',
        message: 'API key not found',
      });
    }

    // Deactivate API key
    await apiKey.update({ isActive: false });

    // Log audit
    await AuditLog.create({
      userId: user.userId,
      action: 'API_KEY_REVOKE',
      resource: 'api_key',
      resourceId: id,
      details: { name: apiKey.name, platform: apiKey.platform },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('API key revoked', {
      userId: user.userId,
      keyId: id,
      ip: req.ip,
    });

    res.json({
      message: 'API key revoked successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to revoke API key',
    });
  }
});

/**
 * POST /api/keys/validate
 * Validate API key
 */
router.post('/validate', apiKeyRateLimiter, async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || !authService.validateAPIKeyFormat(apiKey)) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Invalid API key format',
      });
    }

    // Find API key
    const keyRecord = await APIKey.findOne({
      where: { key: apiKey, isActive: true },
    });

    if (!keyRecord) {
      auditLogger.warn('API key validation failed - not found', { ip: req.ip });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key',
      });
    }

    // Check expiration
    if (new Date() > keyRecord.expiresAt) {
      await keyRecord.update({ isActive: false });
      auditLogger.warn('API key validation failed - expired', { keyId: keyRecord.id, ip: req.ip });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key expired',
      });
    }

    // Update last used
    await keyRecord.update({ lastUsed: new Date() });

    // Log audit
    await AuditLog.create({
      userId: keyRecord.userId,
      action: 'API_KEY_VALIDATE',
      resource: 'api_key',
      resourceId: keyRecord.id,
      details: { platform: keyRecord.platform },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    res.json({
      valid: true,
      platform: keyRecord.platform,
      expiresAt: keyRecord.expiresAt,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to validate API key',
    });
  }
});

/**
 * POST /api/credentials/store
 * Store encrypted credentials
 */
router.post('/credentials/store', authenticate, validateRequest(storeCredentialSchema), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { type, name, data } = req.body;

    // Encrypt sensitive data
    const encryptedData = encryptionService.encrypt(data);

    // Store credentials
    const credential = await EncryptedCredential.create({
      userId: user.userId,
      type,
      name,
      encryptedData,
    });

    // Log audit
    await AuditLog.create({
      userId: user.userId,
      action: 'CREDENTIAL_STORE',
      resource: 'credential',
      resourceId: credential.id,
      details: { type, name },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('Credential stored', {
      userId: user.userId,
      type,
      name,
      ip: req.ip,
    });

    res.status(201).json({
      message: 'Credential stored successfully',
      credential: {
        id: credential.id,
        type: credential.type,
        name: credential.name,
      },
    });
  } catch (error) {
    auditLogger.error('Credential storage error', { error: (error as Error).message, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to store credential',
    });
  }
});

/**
 * GET /api/credentials
 * Get all credentials for current user
 */
router.get('/credentials', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const credentials = await EncryptedCredential.findAll({
      where: { userId: user.userId },
      attributes: ['id', 'type', 'name', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json({ credentials });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get credentials',
    });
  }
});

/**
 * GET /api/credentials/:id
 * Get and decrypt specific credential
 */
router.get('/credentials/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const credential = await EncryptedCredential.findOne({
      where: { id, userId: user.userId },
    });

    if (!credential) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Credential not found',
      });
    }

    // Decrypt data
    const decryptedData = encryptionService.decryptJSON(credential.encryptedData);

    // Log audit
    await AuditLog.create({
      userId: user.userId,
      action: 'CREDENTIAL_ACCESS',
      resource: 'credential',
      resourceId: id,
      details: { type: credential.type, name: credential.name },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('Credential accessed', {
      userId: user.userId,
      credentialId: id,
      ip: req.ip,
    });

    res.json({
      credential: {
        id: credential.id,
        type: credential.type,
        name: credential.name,
        data: decryptedData,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get credential',
    });
  }
});

export default router;

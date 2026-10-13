import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { authService } from '../utils/auth';
import { User, AuditLog } from '../database/models';
import { validateRequest, authRateLimiter, authenticate } from '../middleware/security';
import { auditLogger } from '../utils/logger';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('admin', 'user', 'trader').default('user'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', authRateLimiter, validateRequest(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      auditLogger.warn('Registration failed - user exists', { email, ip: req.ip });
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // Log audit
    await AuditLog.create({
      userId: user.id,
      action: 'USER_REGISTER',
      resource: 'user',
      resourceId: user.id,
      details: { email, role },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('User registered', { userId: user.id, email, ip: req.ip });

    // Generate tokens
    const tokens = authService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    auditLogger.error('Registration error', { error: (error as Error).message, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register user',
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', authRateLimiter, validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      auditLogger.warn('Login failed - user not found', { email, ip: req.ip });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      auditLogger.warn('Login failed - user inactive', { userId: user.id, ip: req.ip });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is inactive',
      });
    }

    // Verify password
    const isValidPassword = await authService.comparePassword(password, user.password);
    if (!isValidPassword) {
      auditLogger.warn('Login failed - invalid password', { userId: user.id, ip: req.ip });
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Log audit
    await AuditLog.create({
      userId: user.id,
      action: 'USER_LOGIN',
      resource: 'user',
      resourceId: user.id,
      details: { email },
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('User logged in', { userId: user.id, email, ip: req.ip });

    // Generate tokens
    const tokens = authService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    });
  } catch (error) {
    auditLogger.error('Login error', { error: (error as Error).message, ip: req.ip });
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to login',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validateRequest(refreshSchema), async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const payload = authService.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findByPk(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const tokens = authService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    auditLogger.info('Token refreshed', { userId: user.id, ip: req.ip });

    res.json({
      message: 'Token refreshed successfully',
      ...tokens,
    });
  } catch (error) {
    auditLogger.warn('Token refresh failed', { error: (error as Error).message, ip: req.ip });
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired refresh token',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Log audit
    await AuditLog.create({
      userId: user.userId,
      action: 'USER_LOGOUT',
      resource: 'user',
      resourceId: user.userId,
      details: {},
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      status: 'success',
    });

    auditLogger.info('User logged out', { userId: user.userId, ip: req.ip });

    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to logout',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;
    const user = await User.findByPk(userPayload.userId, {
      attributes: ['id', 'email', 'role', 'isActive', 'lastLogin', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found',
      });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user info',
    });
  }
});

export default router;

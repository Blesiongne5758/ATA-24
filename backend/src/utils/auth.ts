import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import { encryptionService } from './encryption';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'trader';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Authentication service for JWT and password management
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  /**
   * Compare password with hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if matches
   */
  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   * @param payload - Token payload
   * @returns Access token
   */
  public generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Generate JWT refresh token
   * @param payload - Token payload
   * @returns Refresh token
   */
  public generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  }

  /**
   * Generate token pair (access + refresh)
   * @param payload - Token payload
   * @returns Token pair
   */
  public generateTokenPair(payload: JWTPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: config.jwt.expiresIn,
    };
  }

  /**
   * Verify access token
   * @param token - Access token
   * @returns Decoded payload
   */
  public verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   * @param token - Refresh token
   * @returns Decoded payload
   */
  public verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification
   * @param token - JWT token
   * @returns Decoded payload
   */
  public decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  /**
   * Generate API key
   * @returns API key in format PJBOT-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
   */
  public generateAPIKey(): string {
    const segments = 5;
    const segmentLength = 5;
    const keyParts: string[] = [];

    for (let i = 0; i < segments; i++) {
      keyParts.push(encryptionService.generateToken(segmentLength).toUpperCase());
    }

    return `PJBOT-${keyParts.join('-')}`;
  }

  /**
   * Validate API key format
   * @param apiKey - API key to validate
   * @returns True if valid format
   */
  public validateAPIKeyFormat(apiKey: string): boolean {
    const regex = /^PJBOT-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/;
    return regex.test(apiKey);
  }
}

export const authService = AuthService.getInstance();

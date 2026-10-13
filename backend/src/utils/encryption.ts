import CryptoJS from 'crypto-js';
import config from '../config';

/**
 * Encryption utility for sensitive data
 * Uses AES-256-CBC encryption
 */
export class EncryptionService {
  private static instance: EncryptionService;
  private key: string;
  private algorithm: string;

  private constructor() {
    this.key = config.encryption.key;
    this.algorithm = config.encryption.algorithm;
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Encrypt sensitive data
   * @param data - Data to encrypt (string or object)
   * @returns Encrypted string
   */
  public encrypt(data: string | object): string {
    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(dataString, this.key);
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt encrypted data
   * @param encryptedData - Encrypted string
   * @returns Decrypted string
   */
  public decrypt(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Decrypt and parse JSON data
   * @param encryptedData - Encrypted string
   * @returns Parsed object
   */
  public decryptJSON<T>(encryptedData: string): T {
    const decrypted = this.decrypt(encryptedData);
    return JSON.parse(decrypted) as T;
  }

  /**
   * Hash data using SHA-256
   * @param data - Data to hash
   * @returns Hash string
   */
  public hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Generate secure random token
   * @param length - Token length (default: 32)
   * @returns Random token
   */
  public generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomBytes = CryptoJS.lib.WordArray.random(length);
    const bytes = CryptoJS.enc.Hex.parse(randomBytes.toString()).words;
    
    for (let i = 0; i < length; i++) {
      token += chars[bytes[i % bytes.length] % chars.length];
    }
    
    return token;
  }

  /**
   * Mask sensitive data for logging
   * @param data - Data to mask
   * @param visibleChars - Number of characters to show (default: 4)
   * @returns Masked string
   */
  public mask(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    return data.substring(0, visibleChars) + '*'.repeat(data.length - visibleChars);
  }
}

export const encryptionService = EncryptionService.getInstance();

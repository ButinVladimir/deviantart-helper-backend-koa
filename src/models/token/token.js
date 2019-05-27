import { promisify } from 'util';
import {
  createCipheriv,
  createDecipheriv,
  scrypt,
  randomBytes,
} from 'crypto';
import Config from '../../config/config';

const scryptAsync = promisify(scrypt);
const cipherAlgorithm = 'aes-256-gcm';
const cipherKeySize = 32;
const ivSize = 16;
const saltSize = 64;
const decryptedTokenEncoding = 'utf8';
const dbEncoding = 'base64';

/**
 * Token model object.
 */
export default class TokenModel {
  /**
   * @description
   * The constructor.
   */
  constructor() {
    this.token = '';
    this.expires = 0;
    this.iv = '';
    this.authTag = '';
    this.salt = '';
  }

  /**
   * @description
   * Encrypts token.
   *
   * @param {string} token - The token to encrypt.
   * @param {number} expires - The timestamp when token expires.
   * @param {Config} config - The config.
   */
  async encrypt(token, expires, config) {
    this.salt = randomBytes(saltSize).toString(dbEncoding);
    const cipherKey = await scryptAsync(config.oauthConfig.tokenKey, this.salt, cipherKeySize);
    const iv = randomBytes(ivSize);
    const cipher = createCipheriv(cipherAlgorithm, cipherKey, iv);

    this.token = cipher.update(token, decryptedTokenEncoding, dbEncoding);
    this.token += cipher.final(dbEncoding);
    this.authTag = cipher.getAuthTag().toString(dbEncoding);
    this.iv = iv.toString(dbEncoding);
    this.expires = expires;
  }

  /**
   * @description
   * Decrypts token.
   *
   * @param {Config} config - The config.
   * @returns {string} The decrypted token.
   */
  async decrypt(config) {
    if (Date.now() >= this.expires) {
      throw new Error('Token has expired');
    }

    const cipherKey = await scryptAsync(config.oauthConfig.tokenKey, this.salt, cipherKeySize);
    const iv = Buffer.from(this.iv, dbEncoding);
    const decipher = createDecipheriv(cipherAlgorithm, cipherKey, iv);
    decipher.setAuthTag(Buffer.from(this.authTag, dbEncoding));

    let token = decipher.update(this.token, dbEncoding, decryptedTokenEncoding);
    token += decipher.final(decryptedTokenEncoding);

    return token;
  }
}

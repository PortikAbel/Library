import crypto from 'crypto';
import { promisify } from 'util';
import * as config from '../config/hashConfig.js';

const pbkdf2 = promisify(crypto.pbkdf2);

export async function createHash(password) {
  const salt = crypto.randomBytes(config.saltSize);
  const hash = await pbkdf2(password, salt, config.iterations, config.hashSize, config.alg);
  return Buffer.concat([hash, salt]).toString('hex');
}

export async function checkHash(password, hashWithSalt) {
  const expectedHash = hashWithSalt.substring(0, config.hashSize * 2);
  const salt = Buffer.from(hashWithSalt.substring(config.hashSize * 2), 'hex');
  const binaryHash = await pbkdf2(password, salt, config.iterations, config.hashSize, config.alg);
  const actualHash = binaryHash.toString('hex');
  return expectedHash === actualHash;
}

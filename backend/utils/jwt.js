import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Sign a JWT for a user ID
 * @param {string} userId 
 * @returns {string} Signed JWT
 */
export function generateToken(userId) {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Verify and decode a JWT
 * @param {string} token 
 * @returns {object} Decoded token payload
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export default { generateToken, verifyToken };

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import type { StoredUser } from './store.js';

export interface JwtPayload {
  sub: string; // user id
  role: string;
  email: string;
}

export function signToken(user: StoredUser): string {
  const payload: JwtPayload = { sub: user.id, role: user.role, email: user.email };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

export function comparePassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

/** Strip secrets before returning a user to a client. */
export function publicUser(user: StoredUser) {
  const { passwordHash, ...rest } = user;
  return rest;
}

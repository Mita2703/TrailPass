import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from './errors';

export interface TokenPayload {
  sub: string;
  role: Role;
}

export const signAccessToken = (user: { id: string; role: Role }) =>
  jwt.sign({ sub: user.id, role: user.role } satisfies TokenPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });

/** Wajib login: membaca header "Authorization: Bearer <token>". */
export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new AppError(401, 'Belum login', 'UNAUTHORIZED'));
  try {
    const decoded = jwt.verify(header.slice(7), env.JWT_SECRET) as unknown as TokenPayload;
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch {
    next(new AppError(401, 'Sesi tidak valid atau sudah berakhir', 'UNAUTHORIZED'));
  }
};

/** Pembatasan peran. Dipakai setelah authenticate. */
export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, 'Belum login', 'UNAUTHORIZED'));
    if (!roles.includes(req.user.role)) return next(new AppError(403, 'Tidak berwenang', 'FORBIDDEN'));
    next();
  };
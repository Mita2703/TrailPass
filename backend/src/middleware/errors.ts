import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

/** Membungkus handler async supaya galatnya diteruskan ke errorHandler. */
export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'Endpoint tidak ditemukan', 'NOT_FOUND'));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data yang dikirim tidak valid',
        details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({ data: null, error: { code: err.code ?? 'ERROR', message: err.message } });
  }
  if (env.NODE_ENV !== 'test') console.error(err);
  return res.status(500).json({ data: null, error: { code: 'INTERNAL', message: 'Terjadi kesalahan pada server' } });
};
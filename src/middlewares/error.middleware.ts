import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpException } from '@/common/exceptions';
import { logger } from '@/lib/logger';

export const errorMiddleware: ErrorRequestHandler = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status: number = error.status || 500;
  const code: number = error.code || 5000;
  const message: string = error.message || 'Something went wrong';

  logger.error(`${req.method} ${req.path} ${status} ${message}`);

  res.status(status).json({
    code,
    message,
  });
  next();
};

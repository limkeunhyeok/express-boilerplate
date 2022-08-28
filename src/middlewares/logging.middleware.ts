import { Request, RequestHandler } from 'express';
import morgan, { StreamOptions } from 'morgan';
import { logger } from '@/lib/logger';
import { nodeEnv } from '@/config';

const stream: StreamOptions = { write: (message) => logger.http(message) };

morgan.token('body', (req: Request) => {
  return JSON.stringify(req.body);
});

const skip = () => {
  const env = nodeEnv || 'development';
  return env !== 'development';
};

export const loggingMiddleware: RequestHandler = morgan(
  ':method :url :body :status :res[content-length] - :response-time ms',
  { stream, skip }
);

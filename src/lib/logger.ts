import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import path from 'path';
import { nodeEnv } from '@/config';

const { combine, timestamp, printf, colorize } = winston.format;

const logDir = 'logs';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = (): string => {
  const isDevelopment = nodeEnv === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  printf((info) => {
    if (info.stack) {
      return `${info.timestamp} [${info.level}]: ${info.message} \n Error Stack: ${info.stack}`;
    }
    return `${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

const consoleOpts = {
  handleExceptions: true,
  level: nodeEnv === 'product' ? 'error' : 'debug',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })
  ),
};

const transports = [
  new winston.transports.Console(consoleOpts),
  new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(`./${logDir}`, '/error'),
    filename: '%DATE%.error.log',
    maxFiles: 30,
    zippedArchive: true,
  }),
  new winstonDaily({
    level: 'debug',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(`./${logDir}`, '/combine'),
    filename: '%DATE%.combine.log',
    maxFiles: 7,
    zippedArchive: true,
  }),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports,
});

import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const port = process.env.PORT || 4000;
export const dbHost = process.env.DB_URL || 'mongodb://localhost:27017/dev';
export const jwtSecret = process.env.JWT_SECRET || 'keyboard cat';
export const nodeEnv = process.env.NODE_ENV || 'development';
export const saltRound = process.env.SALT_ROUND || 10;

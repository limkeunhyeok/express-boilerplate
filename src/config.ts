import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const port = process.env.PORT || 4000;
export const dbHost =
  process.env.DB_URL || 'mongodb://chungdaeking-mongo:27017/boilerplate';
export const jwtSecret = process.env.JWT_SECRET || 'keyboardCat';
export const nodeEnv = process.env.NODE_ENV || 'development';
export const saltRound = process.env.SALT_ROUND || 10;

import { dbHost } from '@/config';
import { UserModel } from '@/models/user';
import mongoose, { Connection } from 'mongoose';
import { logger } from './logger';

export const getConnection = async (): Promise<Connection> => {
  const connection: Connection = await mongoose.createConnection(`${dbHost}-test`);
  return connection;
};

export const initializeDatabase = async (): Promise<void> => {
  logger.info('Connecting to MongoDB');

  // TODO: nodeEnv에 따라서 dbHost 변경
  await mongoose.connect(dbHost);

  // TODO: nodeEnv에 따서 debug 변경
  mongoose.set('debug', true);

  await UserModel.createAdmin();

  logger.info('Connection established');

  mongoose.connection.on('error', logger.error).on('disconnected', initializeDatabase);
};

export const closeDatabase = async (connection: Connection): Promise<void> => {
  await connection.close();
};

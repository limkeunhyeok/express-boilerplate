import { dbHost } from '@/config';
import { UserModel } from '@/models/user';
import mongoose, { Connection } from 'mongoose';
import { logger } from '@/lib/logger';

export const getConnection = async (): Promise<Connection> => {
  const connection: Connection = await mongoose.createConnection(`${dbHost}-test`);

  mongoose.set('debug', true);

  await UserModel.createAdmin();

  return connection;
};

export const initializeDatabase = async (): Promise<void> => {
  // logger.info(`Connecting to MongoDB ${dbHost}`);
  console.log(`Connecting to MongoDB ${dbHost}`);

  // TODO: nodeEnv에 따라서 dbHost 변경
  await mongoose.connect(`${dbHost}`);

  // TODO: nodeEnv에 따서 debug 변경
  // mongoose.set('debug', true);

  await UserModel.createAdmin();

  console.log('Connection established');
  // logger.info('Connection established');
};

export const closeDatabase = async (connection: Connection | null): Promise<void> => {
  if (!connection) {
    await connection.close();
  }
};

mongoose.connection.on('error', logger.error).on('disconnected', initializeDatabase);

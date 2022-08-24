import { dbHost } from '@/config';
import { UserModel } from '@/models/user';
import mongoose, { Connection } from 'mongoose';

export const getConnection = async (): Promise<Connection> => {
  const connection: Connection = await mongoose.createConnection(`${dbHost}-test`);
  return connection;
};

export const initializeDatabase = async (): Promise<void> => {
  console.log('Connecting to MongoDB');

  // TODO: nodeEnv에 따라서 dbHost 변경
  await mongoose.connect(dbHost);

  await UserModel.createAdmin();

  console.log('Connection established');

  mongoose.connection.on('error', console.error).on('disconnected', initializeDatabase);
};

export const closeDatabase = async (connection: Connection): Promise<void> => {
  await connection.close();
};

import { Connection } from 'mongoose';
import { getConnection, closeDatabase, initializeDatabase } from '../../src/lib/database';

// 이유는 모르겠으나, initializeDatabase로 해야 돌아감

// let connection: Connection | null = null;

beforeEach(async () => {
  await initializeDatabase();
  // connection = await getConnection();
});

// afterEach(async () => {
//   await closeDatabase(connection as Connection);
// });

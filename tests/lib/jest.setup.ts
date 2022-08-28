import { Connection } from 'mongoose';
import { getConnection, closeDatabase } from '../../src/lib/database';

let connection: Connection | null = null;

beforeEach(async () => {
  connection = await getConnection();
});

afterEach(async () => {
  await closeDatabase(connection as Connection);
});

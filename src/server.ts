import App from './app';
import { initializeDatabase } from './lib/database';

async function startServer() {
  await initializeDatabase();

  const app = new App();

  app.listen();
}

startServer();

import AuthController from './api/auth/auth.controller';
import App from './app';
import { initializeDatabase } from './lib/database';

async function startServer() {
  await initializeDatabase();

  const app = new App([new AuthController()]);

  app.listen();
}

startServer();

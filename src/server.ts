import AuthController from './api/auth/auth.controller';
import UserController from './api/users/user.controller';
import App from './app';
import { initializeDatabase } from './lib/database';

async function startServer() {
  await initializeDatabase();

  const app = new App([new AuthController(), new UserController()]);

  app.listen();
}

startServer();

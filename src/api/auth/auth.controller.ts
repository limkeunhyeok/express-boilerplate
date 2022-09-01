import { Controller } from '@/common/interfaces';
import { ResponseHandler } from '@/lib/response-handler';
import { UserModel } from '@/models/user';
import { RequestHandler, Router } from 'express';
import { AuthService } from './auth.service';

export default class AuthController implements Controller {
  path = '/auth';
  router = Router();

  authService = new AuthService(UserModel);

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();

    router
      .get('/', ResponseHandler(this.authentication))
      .post('/token', ResponseHandler(this.refreshToken))
      .post('/sign-in', ResponseHandler(this.signIn))
      .get('/sign-up', ResponseHandler(this.signUp));

    this.router.use(this.path, router);
  }

  authentication: RequestHandler = (req) => {
    return;
  };

  refreshToken: RequestHandler = (req) => {
    return;
  };

  signIn: RequestHandler = (req) => {
    return;
  };

  signUp: RequestHandler = (req) => {
    return;
  };
}

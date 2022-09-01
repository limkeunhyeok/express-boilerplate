import { Controller } from '@/common/interfaces';
import { ResponseHandler } from '@/lib/response-handler';
import { UserModel } from '@/models/user';
import { RequestHandler, Router } from 'express';
import { UserService } from './user.service';

export default class UserController implements Controller {
  path = '/users';
  router = Router();

  userService = new UserService(UserModel);

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();

    router
      .get('/', ResponseHandler(this.findAll))
      .get('/:userId', ResponseHandler(this.findOneByUserId))
      .put('/:userId', ResponseHandler(this.updateInfoByUserId))
      .put('/:userId/password', ResponseHandler(this.updatePasswordByUserId))
      .delete('/:userId', ResponseHandler(this.deleteOneByUserId));

    this.router.use(this.path, router);
  }

  deleteOneByUserId: RequestHandler = (req) => {
    return;
  };

  findOneByUserId: RequestHandler = (req) => {
    return;
  };

  updateInfoByUserId: RequestHandler = (req) => {
    return;
  };

  findAll: RequestHandler = (req) => {
    return;
  };

  updatePasswordByUserId: RequestHandler = (req) => {
    return;
  };
}

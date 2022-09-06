import { RoleEnum } from '@/common/enums';
import { Controller } from '@/common/interfaces';
import { ResponseHandler } from '@/lib/response-handler';
import { authorize } from '@/middlewares/auth.middleware';
import {
  getDataFromRequest,
  validationMiddleware,
} from '@/middlewares/validation.middleware';
import { UserModel } from '@/models/user';
import { RequestHandler, Router } from 'express';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UserIdDto } from './dtos/user-id.dto';
import { User } from './entities/user.entity';
import { UserResponse } from './response/user.response';
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
      .get('/', authorize([RoleEnum.ADMIN]), ResponseHandler(this.findAll))
      .get(
        '/:userId',
        authorize([RoleEnum.ADMIN, RoleEnum.MEMBER]),
        validationMiddleware(UserIdDto, ['params']),
        ResponseHandler(this.findOneByUserId)
      )
      .put(
        '/:userId',
        authorize([RoleEnum.ADMIN, RoleEnum.MEMBER]),
        validationMiddleware(UpdateUserInfoDto, ['params', 'body']),
        ResponseHandler(this.updateInfoByUserId)
      )
      .put(
        '/:userId/password',
        authorize([RoleEnum.ADMIN, RoleEnum.MEMBER]),
        validationMiddleware(UpdateUserPasswordDto, ['params', 'body']),
        ResponseHandler(this.updatePasswordByUserId)
      )
      .delete(
        '/:userId',
        authorize([RoleEnum.ADMIN]),
        validationMiddleware(UserIdDto, ['params']),
        ResponseHandler(this.deleteOneByUserId)
      );

    this.router.use(this.path, router);
  }

  deleteOneByUserId: RequestHandler = async (req, res): Promise<UserResponse> => {
    const { userId } = res.locals.user;
    const user: User = await this.userService.deleteOneByUserId({ userId });
    return user.toJson();
  };

  findOneByUserId: RequestHandler = async (req, res): Promise<UserResponse> => {
    const { userId } = res.locals.user;
    const user: User = await this.userService.findOneByUserId({ userId });
    return user.toJson();
  };

  updateInfoByUserId: RequestHandler = async (req, res) => {
    const params: UpdateUserInfoDto = getDataFromRequest(req);
    const { userId } = res.locals.user;
    params.userId = userId;
    const user: User = await this.userService.updateInfoByUserId(params);
    return user;
  };

  findAll: RequestHandler = async (req): Promise<UserResponse[]> => {
    const users: UserResponse[] = await this.userService.findAll();
    return users;
  };

  updatePasswordByUserId: RequestHandler = (req) => {
    const params: UpdateUserPasswordDto = getDataFromRequest(req);
    const { userId } = res.locals.user;
    params.userId = userId;
    const user: User = await this.userService.updatePasswordByUserId(params);
    return user.toJson();
  };
}

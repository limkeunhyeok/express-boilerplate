import { Controller } from '@/common/interfaces';
import { ResponseHandler } from '@/lib/response-handler';
import {
  getDataFromRequest,
  validationMiddleware,
} from '@/middlewares/validation.middleware';
import { authorize } from '@/middlewares/auth.middleware';
import { UserModel } from '@/models/user';
import { RequestHandler, Router } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { RoleEnum } from '@/common/enums';
import { UserResponse } from '../users/response/user.response';
import { User } from '../users/entities/user.entity';
import { TokenResponse } from './response/token.reponse';

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
      .get(
        '/',
        authorize([RoleEnum.ADMIN, RoleEnum.MEMBER]),
        ResponseHandler(this.authentication)
      )
      .post(
        '/token',
        validationMiddleware(RefreshTokenDto, ['body']),
        ResponseHandler(this.refreshToken)
      )
      .post(
        '/sign-in',
        validationMiddleware(SignInDto, ['body']),
        ResponseHandler(this.signIn)
      )
      .get(
        '/sign-up',
        validationMiddleware(SignUpDto, ['body']),
        ResponseHandler(this.signUp)
      );

    this.router.use(this.path, router);
  }

  authentication: RequestHandler = async (req, res): Promise<UserResponse> => {
    const { userId } = res.locals.userPayload;
    const user: User = await this.authService.authentication({ userId });
    return user.toJson();
  };

  refreshToken: RequestHandler = (req): TokenResponse => {
    const params: RefreshTokenDto = getDataFromRequest(req);
    const tokens: TokenResponse = this.authService.refreshToken(params);
    return tokens;
  };

  signIn: RequestHandler = async (req): Promise<TokenResponse> => {
    const params: SignInDto = getDataFromRequest(req);
    const tokens: TokenResponse = await this.authService.signIn(params);
    return tokens;
  };

  signUp: RequestHandler = async (req): Promise<TokenResponse> => {
    const params: SignUpDto = getDataFromRequest(req);
    const tokens: TokenResponse = await this.authService.signUp(params);
    return tokens;
  };
}

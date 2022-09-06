import { ACCESS_IS_DENIED, INVALID_TOKEN } from '@/common/constants';
import { RoleEnum } from '@/common/enums';
import { ForbiddenException, UnauthorizedException } from '@/common/exceptions';
import { verifyToken } from '@/lib/jwt';
import { RequestHandler } from 'express';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const bearerToken: string = req.headers.authorization;
  if (bearerToken) {
    try {
      const token = bearerToken.replace(/^Bearer /, '');
      const decoded = verifyToken(token);
      res.locals.user = decoded;
      return next();
    } catch (err) {
      return next(new UnauthorizedException(INVALID_TOKEN));
    }
  } else {
    return next();
  }
};

export const authorize =
  (roles: RoleEnum[]) =>
  (req, res, next): RequestHandler => {
    if (!res.locals.user) {
      return next(new UnauthorizedException(INVALID_TOKEN));
    }

    const { type } = res.locals.user;

    if (!roles.includes(type)) {
      return next(new ForbiddenException(ACCESS_IS_DENIED));
    }
    return next();
  };

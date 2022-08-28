import { INVALID_TOKEN } from '@/common/constants/unauthorized.const';
import { UnauthorizedException } from '@/common/exceptions';
import { verifyToken } from '@/lib/jwt';
import { RequestHandler } from 'express';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const bearerToken: string = req.headers.authorization;
  if (bearerToken) {
    try {
      const token = bearerToken.replace(/^Bearer /, ' ');
      const decoded = verifyToken(token);
      res.locals.user = decoded;
      next();
    } catch (err) {
      next(new UnauthorizedException(INVALID_TOKEN));
    }
  } else {
    next();
  }
};

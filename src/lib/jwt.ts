import { TokenPayload } from '@/common/interfaces/token.interface';
import { jwtSecret } from '@/config';
import * as jwt from 'jsonwebtoken';

// TODO: 나중에 refresh token용 따로 해야될 듯
export function createToken(payload: TokenPayload, options?: jwt.SignOptions): string {
  return jwt.sign(payload, jwtSecret, {
    algorithm: 'HS256',
    expiresIn: '1d',
    ...options,
  });
}

export function verifyToken(token: string, options?: jwt.VerifyOptions): TokenPayload {
  const decoded = jwt.verify(token, jwtSecret, options) as TokenPayload;
  return decoded;
}

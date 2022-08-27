import { ResponseFormat } from '../interfaces';
import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor({ message = 'Unauthorized', code }: ResponseFormat) {
    super(401, message, code);
  }
}

import { ResponseFormat } from '../interfaces';
import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  constructor({ message = 'Forbidden', code }: ResponseFormat) {
    super(403, message, code);
  }
}

import { ResponseFormat } from '../interfaces';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor({ message = 'Bad request', code }: ResponseFormat) {
    super(400, message, code);
  }
}

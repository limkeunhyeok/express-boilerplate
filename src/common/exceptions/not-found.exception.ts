import { ResponseFormat } from '../interfaces';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor({ message = 'Not found', code }: ResponseFormat) {
    super(404, message, code);
  }
}

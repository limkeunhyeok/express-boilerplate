import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

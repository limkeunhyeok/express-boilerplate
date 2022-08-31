import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Response as HttpResponse } from './response';

export const ResponseHandler =
  (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler(req, res, next);

      const response = new HttpResponse({ code: 0, message: 'success' })
        .data(result)
        .toJson();

      return res.json(response);
    } catch (error) {
      return next(error);
    }
  };

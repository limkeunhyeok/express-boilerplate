import { INVALID_DATA } from '@/common/constants/bad-request.const';
import { BadRequestException } from '@/common/exceptions';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Handler, Request } from 'express';

export function getDataFromRequest(req: Request) {
  const data = {
    ...req.query,
    ...req.body,
    ...req.params,
  };
  return data;
}

export function getDataFromRequestByParams(req: Request, params: string[]) {
  let data = {};
  for (const param of params) {
    data = Object.assign(data, req[param]);
  }

  return data;
}

export const validationMiddleware = <T extends object>(
  type: ClassConstructor<T>,
  params: string[],
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): Handler => {
  return (req, res, next) => {
    const data = getDataFromRequestByParams(req, params);
    validate(plainToClass(type, data), {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        next(new BadRequestException(INVALID_DATA));
      }
      next();
    });
  };
};

import request, { Response } from 'supertest';
import App from '../../src/app';
import { RoleEnum } from '../../src/common/enums';
import { UserRaw } from '../../src/models/user';
import AuthController from '../../src/api/auth/auth.controller';
import { createUser, mockUserRaw } from '../mockup/user';
import { extractLoginParamsToUser } from './extractor';

export interface Headers {
  token?: string;
}

export function getServer() {
  const app = new App([new AuthController()]);
  return app.getServer();
}

export function isApiResponse(body: Record<string, any>) {
  return typeof body.code === 'number';
}

export function expectResponseSucceed(res: Response) {
  const data = res.body;
  if (isApiResponse(data)) {
    expect(data.code).toBe(0);
    expect(data.message).toBe('success');
    expect(data.data).not.toBeNull();
  } else {
    expect(data).not.toBeNull();
  }
}

export function expectResponseFailed(res: Response) {
  const data = res.body;
  if (isApiResponse(data)) {
    expect(typeof data.code).toBe('number');
    expect(typeof data.message).toBe('string');
    expect(data.data).toBeUndefined();
  } else {
    expect(typeof data.status).toBe('number');
    expect(data.message).not.toBeNull();
  }
}

export function withHeadersBy(
  headers: Headers,
  options?: Partial<Record<keyof Headers, boolean>>
) {
  return function withHeaders(req: request.Test) {
    return setHeaders(req, headers, options);
  };
}

export function getHeadersFrom(res: Response, headers: Headers = {}): Headers {
  const token = headers.token;
  return {
    token,
  };
}

export async function fetchHeaders(req: request.SuperTest<request.Test>) {
  const res = await req.get('/health-check').expect(200);
  return getHeadersFrom(res);
}

export function setHeaders(
  req: request.Test,
  headers: Headers,
  options: Partial<Record<keyof Headers, boolean>> = {}
) {
  if (headers.token && !(typeof options.token !== 'undefined' && !options.token)) {
    req.auth(headers.token, { type: 'bearer' });
  }
  return req;
}

export function getResponseData(res: Response) {
  const body = res.body;

  if (isApiResponse(body)) {
    return body.data;
  } else {
    return body;
  }
}

export async function fetchUserTokenAndHeaders(
  req: request.SuperTest<request.Test>,
  userType: RoleEnum = RoleEnum.MEMBER
) {
  const userRaw: UserRaw = mockUserRaw(userType);

  await createUser(userRaw);

  const headers = await fetchHeaders(req);
  const withHeaders = withHeadersBy(headers);

  const loginParams = extractLoginParamsToUser(userRaw);

  const res = await withHeaders(req.post('/api/auth/sign-in').send(loginParams)).expect(
    200
  );

  const resData = getResponseData(res);
  const headersWithToken = getHeadersFrom(res, {
    ...headers,
    token: resData.accessToken,
  });
  return headersWithToken;
}

export async function fetchAdminTokenAndHeaders(req: request.SuperTest<request.Test>) {
  const headers = await fetchHeaders(req);
  const withHeaders = withHeadersBy(headers);

  const loginParams = { email: 'admin@example.com', password: 'password' };

  const res = await withHeaders(req.post('/api/auth/sign-in').send(loginParams)).expect(
    200
  );

  const resData = getResponseData(res);
  const headersWithToken = getHeadersFrom(res, {
    ...headers,
    token: resData.accessToken,
  });
  return headersWithToken;
}

export const randomEnumKey = (enumeration) => {
  const keys = Object.keys(enumeration).filter(
    (k) => !(Math.abs(Number.parseInt(k)) + 1)
  );
  const enumKey = keys[Math.floor(Math.random() * keys.length)];
  return enumKey;
};

import request from 'supertest';
import {
  expectResponseFailed,
  expectResponseSucceed,
  fetchHeaders,
  getResponseData,
  getServer,
  isApiResponse,
  withHeadersBy,
} from '../../lib/utils';
import { createUser, mockUserRaw } from '../../mockup/user';
import { extractLoginParamsToUser } from '../../lib/extractor';
import { expectTokenResponseSucceed } from '../../expectaion/token';

describe('Auth API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/api/auth';

  let headers: any;
  let withHeadersNotIncludeToken: any;
  beforeAll(async () => {
    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);
  }, 10000);

  describe('POST /api/auth/token', () => {
    const apiPath = `${rootApiPath}/token`;
    it('success - user refresh token (200)', async () => {
      // given
      const userRaw = mockUserRaw();
      await createUser(userRaw);

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/api/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      const params = { refreshToken: tokens.refreshToken };

      // when
      const res = await withHeadersIncludeOwnToken(req.post(apiPath).send(params)).expect(
        200
      );

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectTokenResponseSucceed({ result });
    }, 10000);

    it('failed - bad request (400) # required params', async () => {
      // given
      const userRaw = mockUserRaw();
      await createUser(userRaw);

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/api/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      console.log('%%%%', tokens);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      // when
      const res = await withHeadersIncludeOwnToken(req.post(apiPath)).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    }, 10000);
  });
});

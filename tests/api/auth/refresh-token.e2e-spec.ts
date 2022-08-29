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
import { mockUserRaw } from '../../mockup/user';
import { extractLoginParamsToUser } from '../../lib/extractor';
import { expectTokenResponseSucceed } from '../../expectaion/token';

describe('Auth API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/auth';

  let withHeadersIncludeMemberToken: any;

  let headers: any;
  let withHeadersNotIncludeToken: any;
  beforeAll(async () => {
    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);
  });

  describe('POST /auth/token', () => {
    const apiPath = `${rootApiPath}/token`;
    it('success - user refresh token (200)', async () => {
      // given
      const userRaw = mockUserRaw();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      withHeadersIncludeMemberToken = withHeadersBy({ token: tokens.accessToken });

      const params = { refreshToken: tokens.refreshToken };

      // when
      const res = await withHeadersIncludeMemberToken(
        req.post(apiPath).send(params)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectTokenResponseSucceed({ result });
    });

    it('failed - bad request (400) # required params', async () => {
      // given
      const userRaw = mockUserRaw();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      withHeadersIncludeMemberToken = withHeadersBy({ token: tokens.accessToken });

      // when
      const res = await withHeadersIncludeMemberToken(req.post(apiPath)).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

import request from 'supertest';
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  expectResponseFailed,
  expectResponseSucceed,
  fetchHeaders,
  getResponseData,
  getServer,
  isApiResponse,
  withHeadersBy,
} from '../../lib/utils';
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

  describe('POST /api/auth/sign-in', () => {
    const apiPath = `${rootApiPath}/sign-in`;
    it('success - sign in (200)', async () => {
      // given
      const userRaw = mockUserRaw();
      await createUser(userRaw);

      const params = extractLoginParamsToUser(userRaw);

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath).send(params)).expect(
        200
      );

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectTokenResponseSucceed({ result });
    }, 10000);

    it('failed - bad request (400) # required sign in params', async () => {
      // given

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath)).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    }, 10000);

    it('failed - bad request (400) # email or password is incorrect', async () => {
      // given
      const userRaw = mockUserRaw();
      const dummy = mockUserRaw();
      await createUser(userRaw);

      const params = extractLoginParamsToUser(userRaw);
      params.password = dummy.password;

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath).send(params)).expect(
        400
      );

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    }, 10000);

    it('failed - bad request (400) # email or password is incorrect', async () => {
      // given
      const userRaw = mockUserRaw();
      const dummy = mockUserRaw();
      await createUser(userRaw);

      const params = extractLoginParamsToUser(userRaw);
      params.email = dummy.email;

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath).send(params)).expect(
        400
      );

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    }, 10000);
  });
});

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
import { extractCreateUserParamsToUser } from '../../lib/extractor';
import { expectTokenResponseSucceed } from '../../expectaion/token';

describe('Auth API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/auth';

  let headers: any;
  let withHeadersNotIncludeToken: any;
  beforeAll(async () => {
    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);
  });

  describe('POST /auth/sign-up', () => {
    const apiPath = `${rootApiPath}/sign-up`;
    it('success - create user (200)', async () => {
      // given
      const userRaw = mockUserRaw();
      const params = extractCreateUserParamsToUser(userRaw);

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath).send(params)).expect(
        200
      );

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectTokenResponseSucceed({ result });
    });

    it('failed - bad request (400) # required user params', async () => {
      // given

      // when
      const res = await withHeadersNotIncludeToken(req.post(apiPath)).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - bad request (400) # exist user', async () => {
      // given
      const userRaw = mockUserRaw();
      await createUser(userRaw);

      // when
      const res = await withHeadersNotIncludeToken(
        req.post(apiPath).send(userRaw)
      ).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

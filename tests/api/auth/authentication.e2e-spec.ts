import request from 'supertest';
import {
  expectResponseFailed,
  expectResponseSucceed,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  getServer,
  isApiResponse,
  withHeadersBy,
} from '../../lib/utils';
import { expectUserResponseSucceed } from '../../expectaion/user';

describe('Auth API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/auth';

  let memberTokenHeaders: any;
  let withHeadersIncludeMemberToken: any;

  let headers: any;
  let withHeadersNotIncludeToken: any;
  beforeAll(async () => {
    memberTokenHeaders = await fetchUserTokenAndHeaders(req);
    withHeadersIncludeMemberToken = withHeadersBy(memberTokenHeaders);

    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);
  });

  describe('GET /auth', () => {
    const apiPath = `${rootApiPath}`;
    it('success - user authentication (200)', async () => {
      // given

      // when
      const res = await withHeadersIncludeMemberToken(req.get(apiPath)).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectUserResponseSucceed({ result });
    });

    it('failed - unauthorized (401) # invalid token', async () => {
      // given

      // when
      const res = await withHeadersNotIncludeToken(req.get(apiPath)).expect(401);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

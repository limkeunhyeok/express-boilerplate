import request from 'supertest';
import {
  expectResponseFailed,
  expectResponseSucceed,
  fetchAdminTokenAndHeaders,
  fetchHeaders,
  fetchUserTokenAndHeaders,
  getResponseData,
  getServer,
  isApiResponse,
  withHeadersBy,
} from '../../lib/utils';
import { expectUserResponseSucceed } from '../../expectaion/user';

describe('Users API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/api/users';

  let memberTokenHeaders: any;
  let withHeadersIncludeMemberToken: any;

  let headers: any;
  let withHeadersNotIncludeToken: any;

  let adminTokenHeaders: any;
  let withHeadersIncludeAdminToken: any;
  beforeEach(async () => {
    memberTokenHeaders = await fetchUserTokenAndHeaders(req);
    withHeadersIncludeMemberToken = withHeadersBy(memberTokenHeaders);

    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);

    adminTokenHeaders = await fetchAdminTokenAndHeaders(req);
    withHeadersIncludeAdminToken = withHeadersBy(adminTokenHeaders);
  });

  describe('GET /users', () => {
    const apiPath = `${rootApiPath}`;
    it('success - user find all (200)', async () => {
      // given

      // when
      const res = await withHeadersIncludeAdminToken(req.get(apiPath)).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      for (const user of result) {
        expectUserResponseSucceed({ result: user });
      }
    });

    it('failed - unauthorized (401) # invalid token', async () => {
      // given

      // when
      const res = await withHeadersNotIncludeToken(req.get(apiPath)).expect(401);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - forbidden (403) # access is denied', async () => {
      // given

      // when
      const res = await withHeadersIncludeMemberToken(req.get(apiPath)).expect(403);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

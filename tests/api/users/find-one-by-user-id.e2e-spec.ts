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
import { getRandomUser } from '../../lib/random-document';
import { createUser, mockUserRaw } from '../../mockup/user';
import { extractLoginParamsToUser } from '../../lib/extractor';
import mongoose from 'mongoose';

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

  describe('GET /users/:userId', () => {
    const apiPath = `${rootApiPath}`;
    it('success - find one by user id (200) # admin can inquire infomation from any user', async () => {
      // given
      const randomUser = await getRandomUser();
      const params = randomUser['_id'].toString();

      // when
      const res = await withHeadersIncludeAdminToken(
        req.get(`${apiPath}/${params}`)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectUserResponseSucceed({ result });
    });

    it('success - find one by user id (200) # members can only inquire information about themselves', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/api/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      const params = user['_id'].toString();

      // when
      const res = await withHeadersIncludeOwnToken(
        req.get(`${apiPath}/${params}`)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectUserResponseSucceed({ result });
    });

    it('failed - bad request (400) # none exists user', async () => {
      // given
      const params = new mongoose.Types.ObjectId().toString();

      // when
      const res = await withHeadersIncludeAdminToken(
        req.get(`${apiPath}/${params}`)
      ).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - unauthorized (401) # invalid token', async () => {
      // given
      const randomUser = await getRandomUser();
      const params = randomUser['_id'].toString();

      // when
      const res = await withHeadersNotIncludeToken(
        req.get(`${apiPath}/${params}`)
      ).expect(401);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - forbidden (403) # access is denied', async () => {
      // given
      const randomUser = await getRandomUser();
      const params = randomUser['_id'].toString();

      // when
      const res = await withHeadersIncludeMemberToken(
        req.get(`${apiPath}/${params}`)
      ).expect(403);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

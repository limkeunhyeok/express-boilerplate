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
import {
  extractLoginParamsToUser,
  extractUpdateUserParamsToUser,
} from '../../lib/extractor';
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

  describe('PUT /users/:userId', () => {
    const apiPath = `${rootApiPath}`;
    it('success - update one by user id (200) # as an admin, any user can edit infomation', async () => {
      // given
      const randomUser = await getRandomUser();
      const userId = randomUser['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserParamsToUser(newUserRaw);

      // when
      const res = await withHeadersIncludeAdminToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectUserResponseSucceed({ result });
    });

    it('success - delete one by user id (200) # members can only edit their own infomation', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/api/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserParamsToUser(newUserRaw);

      // when
      const res = await withHeadersIncludeOwnToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);

      const result = getResponseData(res);
      expectUserResponseSucceed({ result });
    });

    it('failed - bad request (400) # none exists user', async () => {
      // given
      const userId = new mongoose.Types.ObjectId().toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserParamsToUser(newUserRaw);

      // when
      const res = await withHeadersIncludeAdminToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - unauthorized (401) # invalid token', async () => {
      // given
      const randomUser = await getRandomUser();
      const userId = randomUser['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserParamsToUser(newUserRaw);

      // when
      const res = await withHeadersNotIncludeToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(401);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - forbidden (403) # access is denied', async () => {
      // given
      const randomUser = await getRandomUser();
      const userId = randomUser['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserParamsToUser(newUserRaw);

      // when
      const res = await withHeadersIncludeMemberToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(403);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

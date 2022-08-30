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
import { createUser, mockUserRaw } from '../../mockup/user';
import {
  extractLoginParamsToUser,
  extractUpdateUserPasswordParamsToUser,
} from '../../lib/extractor';

describe('Users API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/users';

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

  describe('PUT /users/:userId/password', () => {
    const apiPath = `${rootApiPath}`;
    it('success - update user password (200) # members can only edit their own password', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserPasswordParamsToUser(userRaw, newUserRaw);

      // when
      const res = await withHeadersIncludeOwnToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);
    });

    it('failed - bad request (400) # required params', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      // when
      const res = await withHeadersIncludeOwnToken(
        req.put(`${apiPath}/${userId}`)
      ).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - bad request (400) # old and new password incorrect', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const loginParams = extractLoginParamsToUser(userRaw);
      const loginResult = await withHeadersNotIncludeToken(
        req.post('/auth/sign-in').send(loginParams)
      ).expect(200);

      const tokens = getResponseData(loginResult);
      const withHeadersIncludeOwnToken = withHeadersBy({ token: tokens.accessToken });

      const newUserRaw1 = mockUserRaw();
      const newUserRaw2 = mockUserRaw();
      const params = extractUpdateUserPasswordParamsToUser(newUserRaw1, newUserRaw2);

      // when
      const res = await withHeadersIncludeOwnToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(400);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });

    it('failed - unauthorized (401) # invalid token', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserPasswordParamsToUser(userRaw, newUserRaw);

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
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserPasswordParamsToUser(userRaw, newUserRaw);

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

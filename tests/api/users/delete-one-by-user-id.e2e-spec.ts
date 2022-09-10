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

  describe('DELETE /users/:userId', () => {
    const apiPath = `${rootApiPath}`;
    it('success - delete one by user id (200) # only admin can delete users', async () => {
      // given
      const randomUser = await getRandomUser();
      const params = randomUser['_id'].toString();

      // when
      const res = await withHeadersIncludeAdminToken(
        req.delete(`${apiPath}/${params}`)
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
        req.delete(`${apiPath}/${params}`)
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
        req.delete(`${apiPath}/${params}`)
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
        req.delete(`${apiPath}/${params}`)
      ).expect(403);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseFailed(res);
    });
  });
});

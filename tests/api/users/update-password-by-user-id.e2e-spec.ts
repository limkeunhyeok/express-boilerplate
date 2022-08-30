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
import { extractUpdateUserPasswordParamsToUser } from '../../lib/extractor';

describe('Users API Test', () => {
  const app = getServer();
  const req = request(app);
  const rootApiPath = '/users';

  let memberTokenHeaders: any;
  let withHeadersIncludeMemberToken: any;

  let headers: any;
  let withHeadersNotIncludeToken: any;

  let adminTokenHeaders: any;
  let withHeadersIncludeAdminToken: any;
  beforeAll(async () => {
    memberTokenHeaders = await fetchUserTokenAndHeaders(req);
    withHeadersIncludeMemberToken = withHeadersBy(memberTokenHeaders);

    headers = await fetchHeaders(req);
    withHeadersNotIncludeToken = withHeadersBy(headers);

    adminTokenHeaders = await fetchAdminTokenAndHeaders(req);
    withHeadersIncludeAdminToken = withHeadersBy(adminTokenHeaders);
  });

  describe('PUT /users/:userId/password', () => {
    const apiPath = `${rootApiPath}`;
    it('success - update user password (200) # as an admin, any user can edit password', async () => {
      // given
      const userRaw = mockUserRaw();
      const user = await createUser(userRaw);
      const userId = user['_id'].toString();

      const newUserRaw = mockUserRaw();
      const params = extractUpdateUserPasswordParamsToUser(userRaw, newUserRaw);

      // when
      const res = await withHeadersIncludeAdminToken(
        req.put(`${apiPath}/${userId}`).send(params)
      ).expect(200);

      // then
      expect(isApiResponse(res.body)).toBe(true);
      expectResponseSucceed(res);
    });

    it('success - update user password (200) # members can only edit their own password', async () => {});

    it('failed - bad request (400) # none exists user', async () => {});

    it('failed - unauthorized (401) # invalid token', async () => {});

    it('failed - forbidden (403) # access is denied', async () => {});
  });
});

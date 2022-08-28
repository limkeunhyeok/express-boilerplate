import * as faker from 'faker';
import { RoleEnum } from '../../src/common/enums';
import { UserModel, UserRaw } from '../../src/models/user';

export function mockUserRaw(type: RoleEnum = RoleEnum.MEMBER): UserRaw {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    nickname: faker.lorem.word(),
    type,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function createUser(userRaw: UserRaw = mockUserRaw()) {
  const data = JSON.parse(JSON.stringify(userRaw));
  const user = await UserModel.createUser(data);
  return user;
}

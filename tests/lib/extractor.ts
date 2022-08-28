import { UserRaw } from '../../src/models/user';

export function extractLoginParamsToUser(userRaw: UserRaw) {
  return {
    email: userRaw.email,
    password: userRaw.password,
  };
}

export function extractCreateUserParamsToUser(userRaw: UserRaw) {
  return {
    email: userRaw.email,
    password: userRaw.password,
    username: userRaw.username,
    nickname: userRaw.nickname,
    type: userRaw.type,
  };
}

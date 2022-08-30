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

export function extractUpdateUserParamsToUser(userRaw: UserRaw) {
  return {
    username: userRaw.username,
    nickname: userRaw.nickname,
    type: userRaw.type,
  };
}

export function extractUpdateUserPasswordParamsToUser(
  oldUserRaw: UserRaw,
  newUserRaw: UserRaw
) {
  return {
    oldPassword: oldUserRaw.password,
    newPassword: newUserRaw.password,
  };
}

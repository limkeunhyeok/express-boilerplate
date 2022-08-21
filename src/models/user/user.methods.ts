import { saltRound } from '@/config';
import bcrypt from 'bcrypt';
import { UserDocument, UserInfo } from './user.types';

export function getUserInfo(this: UserDocument): UserInfo {
  const userInfo: UserInfo = {
    _id: this._id,
    email: this.email,
    username: this.username,
    nickname: this.nickname,
    type: this.type,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
  return userInfo;
}

export function comparePassword(this: UserDocument, password: string): boolean {
  const isMatch = bcrypt.compareSync(password, this.password);

  return isMatch;
}

export async function updateUserPassword(
  this: UserDocument,
  newPassword: string
): Promise<UserDocument> {
  this.password = bcrypt.hashSync(newPassword, saltRound);

  await this.save();

  return this;
}

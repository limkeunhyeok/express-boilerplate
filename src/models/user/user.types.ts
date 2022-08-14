import { Document, Model } from 'mongoose';
import { RoleEnum } from '@/common/enums';

export interface User {
  email: string;
  password: string;
  username: string;
  nickname: string;
  type: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

export type UserInfo = Omit<User, 'password'>;

export interface UserDocument extends User, Document {
  getUserInfo: (this: UserDocument) => UserInfo;
  comparePassword: (this: UserDocument, password: string) => Promise<Boolean>;
  updateUserPassword: (this: UserDocument, password: string) => Promise<Boolean>;
  updateUserInfo: (this: UserDocument, userInfo: Partial<User>) => Promise<UserDocument>;
  deleteUser: (this: UserDocument) => Promise<UserDocument>;
}

export interface UserModel extends Model<UserDocument> {
  createUser: (this: UserModel, user: UserInfo) => Promise<UserInfo>;
  createAdmin: (this: UserModel) => Promise<void>;
  findOneByUserId: (this: UserModel, userId: string) => Promise<UserDocument>;
  findOneByEmail: (this: UserModel, email: string) => Promise<UserDocument>;
  findAll: (this: UserModel) => Promise<UserDocument[]>;
}

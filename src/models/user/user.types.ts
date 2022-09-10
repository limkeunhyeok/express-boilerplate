import { Document, Model } from 'mongoose';
import { RoleEnum } from '@/common/enums';
import { ISODatetime, MongoId } from '@/@types/datatype';

export interface UserRaw {
  email: string;
  password: string;
  username: string;
  nickname: string;
  type: RoleEnum;
  createdAt: ISODatetime;
  updatedAt: ISODatetime;
}

export interface User extends UserRaw {
  _id: MongoId;
}

export type UserInfo = Omit<User, 'password'>;

export interface UserDocument extends UserRaw, Document {
  getUserInfo: (this: UserDocument) => Promise<UserInfo>;
  comparePassword: (this: UserDocument, password: string) => Promise<Boolean>;
  updateUserPassword: (this: UserDocument, password: string) => Promise<UserDocument>;
}

export interface UserModel extends Model<UserDocument> {
  createUser: (this: UserModel, user: Partial<User>) => Promise<UserDocument>;
  createAdmin: (this: UserModel) => Promise<void>;
  asd: (this: UserModel) => Promise<void>;
}

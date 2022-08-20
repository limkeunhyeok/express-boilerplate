import { Document, Model, ObjectId } from 'mongoose';
import { RoleEnum } from '@/common/enums';
import { MongoId } from '@/@types/datatype';

export interface UserRaw {
  email: string;
  password: string;
  username: string;
  nickname: string;
  type: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends UserRaw {
  _id: MongoId
}

export type UserInfo = Omit<User, 'password'>;

export interface UserDocument extends UserRaw, Document {
  getUserInfo: (this: UserDocument) => Promise<UserInfo>;
  comparePassword: (this: UserDocument, password: string) => Promise<Boolean>;
  updateUserPassword: (this: UserDocument, password: string) => Promise<Boolean>;
}

export interface UserModel extends Model<UserDocument> {
  createUser: (this: UserModel, user: Partial<User>) => Promise<UserDocument>;
  createAdmin: (this: UserModel) => Promise<void>;
}
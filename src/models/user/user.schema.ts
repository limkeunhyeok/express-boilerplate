import { RoleEnum } from '@/common/enums';
import { Schema } from 'mongoose';
import { UserDocument, UserModel } from './user.types';
import { createUser, createAdmin } from './user.statics';
import { comparePassword, updateUserPassword, getUserInfo } from './user.methods';

export const UserSchema = new Schema<UserDocument, UserModel>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  nickname: String,
  type: {
    type: String,
    enum: RoleEnum,
    default: RoleEnum.MEMBER,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.statics = {
  createUser,
  createAdmin,
};

UserSchema.methods = {
  updateUserPassword,
  comparePassword,
  getUserInfo,
};

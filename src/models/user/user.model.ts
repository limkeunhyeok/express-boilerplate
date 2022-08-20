import { model } from "mongoose";
import { UserSchema } from "./user.schema";
import { UserDocument, UserModel as IUserModel } from "./user.types";

export const UserModel = model<UserDocument>('user', UserSchema) as IUserModel;

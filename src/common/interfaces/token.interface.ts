import { MongoId } from '@/@types/datatype';
import { RoleEnum } from '../enums';

export interface TokenPayload {
  userId: MongoId;
  type: RoleEnum;
}

export interface TokenResponse {
  token: string;
}

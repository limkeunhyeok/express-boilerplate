import { ISODatetime, MongoId } from '@/@types/datatype';
import { RoleEnum } from '@/common/enums';
import { User as UserJson, UserInfo } from '@/models/user';

export class User {
  constructor(
    public readonly _id: MongoId,
    public readonly email: string,
    public readonly password: string,
    public readonly username: string,
    public readonly nickname: string,
    public readonly type: RoleEnum,
    public readonly createdAt: ISODatetime,
    public readonly updatedAt: ISODatetime
  ) {}

  public static fromJson(json: UserJson) {
    if (!json) return null;
    return new User(
      json._id,
      json.email,
      json.password,
      json.username,
      json.nickname,
      json.type,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }

  public toJson(): UserInfo {
    return {
      _id: this._id,
      email: this.email,
      username: this.username,
      nickname: this.nickname,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

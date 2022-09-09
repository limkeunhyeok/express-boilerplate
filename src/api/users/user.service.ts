import {
  INCORRECT_PASSWORD,
  NONE_EXISTS_USER,
} from '@/common/constants/bad-request.const';
import { BadRequestException } from '@/common/exceptions';
import { IUserModel, User as UserJson, UserDocument } from '@/models/user';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UserIdDto } from './dtos/user-id.dto';
import { User } from './entities/user.entity';

export class UserService {
  constructor(private readonly userModel: IUserModel) {}

  async deleteOneByUserId({ userId }: UserIdDto): Promise<User> {
    const hasUser: UserJson = await this.userModel.findById(userId).lean();
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }

    const deletedUser: UserJson = await this.userModel.findByIdAndDelete(userId).lean();
    return User.fromJson(deletedUser);
  }

  async findOneByUserId({ userId }: UserIdDto): Promise<User> {
    const hasUser: UserJson = await this.userModel.findById(userId).lean();
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }
    return User.fromJson(hasUser);
  }

  async updateInfoByUserId({
    userId,
    username,
    nickname,
    type,
  }: UpdateUserInfoDto): Promise<User> {
    const hasUser: UserJson = await this.userModel.findById(userId).lean();
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }

    const updatedUser: UserJson = await this.userModel.findByIdAndUpdate(userId, {
      username,
      nickname,
      type,
    });
    return User.fromJson(updatedUser);
  }

  async findAll(): Promise<User[]> {
    const users: UserJson[] = await this.userModel.find({}).lean();

    return users.map((user) => {
      return User.fromJson(user);
    });
  }

  async updatePasswordByUserId({
    userId,
    oldPassword,
    newPassword,
  }: UpdateUserPasswordDto): Promise<string> {
    const hasUser: UserDocument = await this.userModel.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }

    const isMatch = await hasUser.comparePassword(oldPassword);
    if (!isMatch) {
      throw new BadRequestException(INCORRECT_PASSWORD);
    }

    await hasUser.updateUserPassword(newPassword);
    return 'You have successfully modified your password.';
  }
}

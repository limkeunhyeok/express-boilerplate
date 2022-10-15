import {
  INCORRECT_PASSWORD,
  NONE_EXISTS_USER,
} from '@/common/constants/bad-request.const';
import { BadRequestException } from '@/common/exceptions';
import { UserDocument } from '@/models/user';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';
import { UserIdDto } from './dtos/user-id.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteOneByUserId({ userId }: UserIdDto): Promise<User> {
    const hasUser: UserDocument = await this.userRepository.findOneById(userId);
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }

    const deletedUser: UserDocument = await this.userRepository.deleteOne(userId);
    return User.fromJson(deletedUser);
  }

  async findOneByUserId({ userId }: UserIdDto): Promise<User> {
    const hasUser: UserDocument = await this.userRepository.findOneById(userId);
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
    const hasUser: UserDocument = await this.userRepository.findOneById(userId);
    if (!hasUser) {
      throw new BadRequestException(NONE_EXISTS_USER);
    }

    const updatedUser: UserDocument = await this.userRepository.updateOne(userId, {
      username,
      nickname,
      type,
    });
    return User.fromJson(updatedUser);
  }

  async findAll(): Promise<User[]> {
    const users: UserDocument[] = await this.userRepository.findAll();

    return users.map((user) => {
      return User.fromJson(user);
    });
  }

  async updatePasswordByUserId({
    userId,
    oldPassword,
    newPassword,
  }: UpdateUserPasswordDto): Promise<string> {
    const hasUser: UserDocument = await this.userRepository.findOneById(userId);
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

import { EXISTS_USER, FAILED_SIGN_IN } from '@/common/constants/bad-request.const';
import { BadRequestException } from '@/common/exceptions';
import { createToken, verifyToken } from '@/lib/jwt';
import { UserDocument } from '@/models/user';
import { UserIdDto } from '../users/dtos/user-id.dto';
import { User } from '../users/entities/user.entity';
import { UserRepository } from '../users/user.repository';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { TokenResponse } from './response/token.reponse';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async authentication({ userId }: UserIdDto): Promise<User> {
    const user: UserDocument = await this.userRepository.findOneById(userId);
    return User.fromJson(user);
  }

  refreshToken({ refreshToken }: RefreshTokenDto): TokenResponse {
    const decoded = verifyToken(refreshToken);
    const { userId, type } = decoded;

    const newAccessToken = createToken({ userId, type });
    const newRefreshToken = createToken({ userId, type });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async signIn({ email, password }: SignInDto): Promise<TokenResponse> {
    const hasUser = await this.userRepository.findOneByFilter({ email });
    if (!hasUser) {
      throw new BadRequestException(FAILED_SIGN_IN);
    }

    const isMatch = await hasUser.comparePassword(password);
    if (!isMatch) {
      throw new BadRequestException(FAILED_SIGN_IN);
    }

    const { _id, type } = hasUser;
    const accessToken = createToken({ userId: _id, type });
    const refreshToken = createToken({ userId: _id, type });

    return { accessToken, refreshToken };
  }

  async signUp({
    email,
    password,
    username,
    nickname,
    type,
  }: SignUpDto): Promise<TokenResponse> {
    const hasUser = await this.userRepository.findOneByFilter({ email });
    if (hasUser) {
      throw new BadRequestException(EXISTS_USER);
    }

    const createdUser = await this.userRepository.create({
      email,
      password,
      username,
      nickname,
      type,
    });

    const accessToken = createToken({ userId: createdUser._id, type: createdUser.type });
    const refreshToken = createToken({ userId: createdUser._id, type: createdUser.type });

    return { accessToken, refreshToken };
  }
}

import { RoleEnum } from '@/common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  type: RoleEnum;
}

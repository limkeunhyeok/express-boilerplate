import { RoleEnum } from '@/common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  type: RoleEnum;
}

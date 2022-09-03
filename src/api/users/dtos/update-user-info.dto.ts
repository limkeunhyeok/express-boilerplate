import { RoleEnum } from '@/common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserIdDto } from './user-id.dto';

export class UpdateUserInfoDto extends UserIdDto {
  @IsString()
  username: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  type: RoleEnum;
}

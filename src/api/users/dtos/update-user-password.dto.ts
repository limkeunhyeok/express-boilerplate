import { IsString } from 'class-validator';
import { UserIdDto } from './user-id.dto';

export class UpdateUserPasswordDto extends UserIdDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}

import { IsString } from 'class-validator';

export class UserIdDto {
  @IsString()
  userId: string;
}

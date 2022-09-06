import { IUserModel } from '@/models/user';
import { UserIdDto } from './dtos/user-id.dto';

export class UserService {
  constructor(private readonly userModel: IUserModel) {}

  deleteOneByUserId({ userId }: UserIdDto) {
    return;
  }

  findOneByUserId() {
    return;
  }

  updateInfoByUserId() {
    return;
  }

  findAll() {
    return;
  }

  updatePasswordByUserId() {
    return;
  }
}

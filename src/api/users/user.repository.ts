import { BaseRepository } from '@/common/abstracts';
import { UserDocument, UserModel } from '@/models/user';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor() {
    super(UserModel);
  }
}

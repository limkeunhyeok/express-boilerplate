import bcrypt from 'bcrypt';
import { UserModel, UserDocument, UserRaw } from './user.types';
import { saltRound } from '@/config';
import { RoleEnum } from '@/common/enums';

export async function createUser(
  this: UserModel,
  user: Partial<UserRaw>
): Promise<UserDocument> {
  user.password = bcrypt.hashSync(user.password, saltRound);

  const document = await this.create(user);
  return document;
}

export async function createAdmin(this: UserModel): Promise<void> {
  const adminEmail = 'admin@example.com';

  const document = await this.findOne({ email: adminEmail });
  if (!document) {
    const now = new Date();
    const admin: UserRaw = {
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', saltRound),
      username: 'admin',
      nickname: 'admin',
      type: RoleEnum.ADMIN,
      createdAt: now,
      updatedAt: now,
    };

    await this.create(admin);
  }
}

import { UserModel } from '../../src/models/user';

export async function getRandomUser() {
  const user = await UserModel.aggregate([{ $sample: { size: 1 } }]);
  return user;
}

import { UserModel } from '../../src/models/user';

export async function getRandomUser() {
  const users = await UserModel.aggregate([{ $sample: { size: 1 } }]);
  return users[0];
}

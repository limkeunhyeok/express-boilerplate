import { Repository } from '@/common/interfaces/repository.interface';
import { UserDocument, IUserModel } from '@/models/user';
import { FilterQuery } from 'mongoose';

export class UserRepository implements Repository<UserDocument> {
  constructor(readonly model: IUserModel) {}

  create = async (data: unknown): Promise<UserDocument> => {
    const user = await this.model.create(data);
    return user;
  };

  findAll = async (): Promise<UserDocument[]> => {
    const users = await this.model.find({});
    return users;
  };

  findByFilter = async (filter: FilterQuery<UserDocument>): Promise<UserDocument[]> => {
    const users = await this.model.find(filter);
    return users;
  };

  findOneById = async (id: string): Promise<UserDocument | null> => {
    const user = await this.model.findById(id);
    return user;
  };

  updateOne = async (id: string, data: unknown): Promise<UserDocument | null> => {
    const user = await this.model.findByIdAndUpdate(id, data, { new: true });
    return user;
  };

  deleteOne = async (id: string): Promise<UserDocument | null> => {
    const user = await this.model.findByIdAndDelete(id, { new: true });
    return user;
  };
}

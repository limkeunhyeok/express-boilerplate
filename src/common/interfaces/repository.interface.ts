import { MongoId } from '@/@types/datatype';
import { FilterQuery } from 'mongoose';

export interface Repository<T> {
  create: (data: unknown) => Promise<T>;
  findAll: () => Promise<T[]>;
  findByFilter: (filterQuery: FilterQuery<T>) => Promise<T[]>;
  findOneByFilter: (filterQuery: FilterQuery<T>) => Promise<T>;
  findOneById: (id: MongoId) => Promise<T>;
  updateOne: (id: MongoId, data: unknown) => Promise<T>;
  deleteOne: (id: MongoId) => Promise<T>;
}

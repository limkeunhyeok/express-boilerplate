import { Document, FilterQuery, Model } from 'mongoose';

export interface Repository<T extends Document> {
  model: Model<T>;
  create: (data: unknown) => Promise<T>;
  findAll: () => Promise<T[]>;
  findByFilter: (filter: FilterQuery<T>) => Promise<T[]>;
  findOneById: (id: string) => Promise<T | null>;
  updateOne: (id: string, data: unknown) => Promise<T | null>;
  deleteOne: (id: string) => Promise<T | null>;
}

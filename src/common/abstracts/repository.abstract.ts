import { MongoId, Nullable } from '@/@types/datatype';
import { Document, FilterQuery, Model } from 'mongoose';
import { NONE_EXISTS_ENTITY } from '../constants/bad-request.const';
import { BadRequestException } from '../exceptions';
import { Repository } from '../interfaces';

export abstract class BaseRepository<T extends Document> implements Repository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: unknown): Promise<T> {
    const entity: T = await this.model.create(data);
    return entity;
  }

  async findAll(): Promise<T[]> {
    const entities: T[] = await this.model.find({});
    return entities;
  }

  async findByFilter(filterQuery: FilterQuery<T>): Promise<T[]> {
    const entities: T[] = await this.model.find(filterQuery);
    return entities;
  }

  async findOneByFilter(filterQuery: FilterQuery<T>): Promise<T> {
    const entity: Nullable<T> = await this.model.findOne(filterQuery);
    if (!entity) {
      throw new BadRequestException(NONE_EXISTS_ENTITY);
    }
    return entity;
  }

  async findOneById(id: MongoId): Promise<T> {
    const entity: Nullable<T> = await this.model.findById(id);
    if (!entity) {
      throw new BadRequestException(NONE_EXISTS_ENTITY);
    }
    return entity;
  }

  async updateOne(id: MongoId, data: unknown): Promise<T> {
    const entity: Nullable<T> = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!entity) {
      throw new BadRequestException(NONE_EXISTS_ENTITY);
    }
    return entity;
  }

  async deleteOne(id: MongoId): Promise<T> {
    const entity: Nullable<T> = await this.model.findByIdAndDelete(id, { new: true });
    if (!entity) {
      throw new BadRequestException(NONE_EXISTS_ENTITY);
    }
    return entity;
  }
}

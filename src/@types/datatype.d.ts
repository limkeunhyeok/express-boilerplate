import { ObjectId } from 'mongoose';

export type MongoId = ObjectId | string;
/** yyyy-MM-ddTHH:mm:ss.zzzZ */
export type ISODatetime = Date;

export type Nullable<T> = T | null;

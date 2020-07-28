import { JsonApiOptions } from './options.interface';

export interface JsonApiDatabaseAdapter {
  findById: <T>(
    modelName: string,
    id: string,
    options: JsonApiOptions,
  ) => Promise<T>;
  find: <T>(
    modelName: string,
    query: Record<string, any>,
    options: JsonApiOptions,
  ) => Promise<Array<T>>;
  create: <T>(
    modelName: string,
    body: Record<string, any>,
    options: JsonApiOptions,
  ) => Promise<T>;
  update: <T>(
    modelName: string,
    id: string,
    body: Record<string, any>,
    options: JsonApiOptions,
  ) => Promise<T>;
  delete: (
    modelName: string,
    id: string,
    options: JsonApiOptions,
  ) => Promise<number>;
  getId: (obj: any) => string;
}

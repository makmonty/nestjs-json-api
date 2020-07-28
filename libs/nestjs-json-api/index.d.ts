import { Request } from 'express';

export type JsonApiMeta = Record<string, any>;

export type JsonApiResourceLinkage =
  | JsonApiResourceIdentifier
  | Array<JsonApiResourceIdentifier>;

export interface JsonApiResource<T> {
  id?: string;
  type: string;
  attributes?: T;
  relationships?: Record<string, any>;
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
}

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
  meta?: JsonApiMeta;
}

export interface JsonApiRelationship {
  links?: JsonApiLinks;
  meta?: JsonApiMeta;
  data?: JsonApiResourceLinkage;
}

export interface JsonApiError {
  id?: string;
  links?: JsonApiLinks;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    paramter?: string;
  };
  meta?: JsonApiMeta;
}

export type JsonApiLink =
  | string
  | {
      href?: string;
      meta?: JsonApiMeta;
    };

export interface JsonApiLinks {
  self?: JsonApiLink;
  related?: JsonApiLink;
  about?: JsonApiLink;
}

export interface JsonApiTopLevelObject<T> {
  data?:
    | JsonApiResource<T>
    | Array<JsonApiResource<T>>
    | JsonApiResourceIdentifier
    | Array<JsonApiResourceIdentifier>;
  errors?: any;
  meta?: JsonApiMeta;
  jsonapi?: any;
  links?: JsonApiLinks;
  included?: JsonApiResource<any>;
}

export interface JsonApiOptions {
  projection?: string;
  populate?: string | Array<string>;
  send?: boolean;
  catch?: boolean;
  parseQuery?: Function;
  parseObject?: Function;
}

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

export class JsonApiService {
  find<T>(
    modelName: string,
    query: any,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T>>;

  findById<T>(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T>>;

  create<T>(
    modelName: string,
    body: any,
    options?: JsonApiOptions,
    url?: string,
  ): Promise<JsonApiTopLevelObject<T>>;

  update<T>(
    modelName: string,
    id: string,
    body: any,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T>>;

  delete(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<void>>;

  getFullUrl(req: Request): string;

  hydrateTopDocument<T>(
    data: any,
    errors: Array<any>,
    type: string,
    options?: JsonApiOptions,
    meta?: any,
  ): JsonApiTopLevelObject<T>;

  hydrateData<T>(
    data: any,
    type: string,
    options?: JsonApiOptions,
  ): JsonApiResource<T> | Array<JsonApiResource<T>>;

  hydrateSingleObject<T>(
    obj: any,
    type: string,
    options?: JsonApiOptions,
  ): JsonApiResource<T>;

  hydrateErrors(errors: Array<any>): Array<JsonApiError>;

  hydrateError(error: any): JsonApiError;
}


export interface JsonApiConfiguration {
  adapter: new () => JsonApiDatabaseAdapter;
  jvTag?: string;
}

export class JsonApiModule {
  static forRoot(config: JsonApiConfiguration): any;
}

export class JsonApiMongooseAdapter implements JsonApiDatabaseAdapter {
  find(
    modelName: string,
    query: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<Array<any>>;

  findById(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<any>;

  create<T>(
    modelName: string,
    body: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<T>;

  update<T>(
    modelName: string,
    id: string,
    body: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<T>;

  delete(modelName: string, id: string): any;

  getId(obj: any): any;
}

// Decorators

export function JsonApiController(
  modelName: string,
  options?: JsonApiOptions,
): any;

export function JsonApiFindById<T>(
  modelName: string,
  paramKey?: string,
  options?: JsonApiOptions,
): MethodDecorator;

export function JsonApiFind<T>(
  modelName: string,
  options?: JsonApiOptions,
): MethodDecorator;

export function JsonApiCreate<T>(
  modelName: string,
  options?: JsonApiOptions,
): MethodDecorator;

export function JsonApiUpdate<T>(
  modelName: string,
  paramKey?: string,
  options?: JsonApiOptions,
): MethodDecorator;

export function JsonApiDelete(
  modelName: string,
  paramKey?: string,
): MethodDecorator;

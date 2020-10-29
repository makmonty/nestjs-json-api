import { Injectable, Inject } from '@nestjs/common';
import { JsonApiDatabaseAdapter } from '../types/database-adapter.interface';
import { JsonApiOptions } from '../types/options.interface';
import {
  JsonApiTopLevelObject,
  JsonApiError,
  JsonApiResource,
} from '../types/json-api';
import { Request } from 'express';

@Injectable()
export class JsonApiService {
  constructor(
    @Inject('JSON_API_DATABASE_ADAPTER')
    private adapter: JsonApiDatabaseAdapter,
    @Inject('JSON_API_JV_TAG')
    private jvTag: string,
  ) {}

  async find<T>(
    modelName: string,
    query: any,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T[]>> {
    const data = await this.adapter.find<T>(modelName, query, options);
    return this.hydrateTopDocument(data, undefined, modelName, options);
  }

  async findById<T>(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T>> {
    const data = await this.adapter.findById<T>(modelName, id, options);
    return data
      ? this.hydrateTopDocument(data, undefined, modelName, options)
      : null;
  }

  async create<T>(
    modelName: string,
    body: any,
    options?: JsonApiOptions,
    url?: string,
  ): Promise<JsonApiTopLevelObject<T>> {
    const data: any = await this.adapter.create<T>(
      modelName,
      body.data.attributes,
      options,
    );

    if (url) {
      data[this.jvTag] = {
        links: {
          self: url + '/' + data._id,
        },
      };
      await this.adapter.update(modelName, data._id, data, options);
    }

    return this.hydrateTopDocument(data, undefined, modelName, options);
  }

  async update<T>(
    modelName: string,
    id: string,
    body: any,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<T>> {
    const data = await this.adapter.update<T>(
      modelName,
      id,
      body.data.attributes,
      options,
    );
    return this.hydrateTopDocument(data, undefined, modelName, options);
  }

  async delete(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<JsonApiTopLevelObject<void>> {
    const count = await this.adapter.delete(modelName, id, options);
    return this.hydrateTopDocument(undefined, undefined, modelName, options, {
      count,
    });
  }

  getFullUrl(req: Request) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
  }

  /**
   * Creates a JSON API top level document
   * http://jsonapi.org/format/#document-top-level
   */

  hydrateTopDocument<T>(
    data: any,
    errors: Array<any>,
    type: string,
    options?: JsonApiOptions,
    meta?: any,
  ): JsonApiTopLevelObject<T> {
    const doc: JsonApiTopLevelObject<T> = {};

    if (data) {
      doc.data = this.hydrateData<T>(data, type, options);
    }

    if (errors) {
      doc.errors = this.hydrateErrors(errors);
    }

    if (meta) {
      doc.meta = meta;
    }

    return doc;
  }

  hydrateData<T>(
    data: any,
    type: string,
    options?: JsonApiOptions,
  ): JsonApiResource<T> | Array<JsonApiResource<T>> {
    return Array.isArray(data)
      ? data.map((obj) => this.hydrateSingleObject<T>(obj, type, options))
      : this.hydrateSingleObject<T>(data, type, options);
  }

  hydrateSingleObject<T>(
    obj: any,
    type: string,
    options?: JsonApiOptions,
  ): JsonApiResource<T> {
    if (obj) {
      const clonedObj = { ...obj };
      const jsonapiData = clonedObj[this.jvTag];
      delete clonedObj[this.jvTag];

      return {
        id: this.adapter.getId(clonedObj),
        type: type,
        attributes: options?.parseObject
          ? options.parseObject(clonedObj)
          : clonedObj,
        ...jsonapiData,
      };
    }

    return null;
  }

  hydrateErrors(errors: Array<any>): Array<JsonApiError> {
    return errors.map((error) => this.hydrateError(error));
  }

  hydrateError(error: any): JsonApiError {
    return {
      status: error.status,
      title: error.message,
      detail: error.description,
      meta: error.meta,
    };
  }
}

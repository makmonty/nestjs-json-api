import { Inject, Req, NotFoundException, HttpException } from '@nestjs/common';
import { JsonApiService } from '../services/json-api.service';
import { Request } from 'express';
import { JsonApiTopLevelObject } from '../types/json-api';
import { JSON_API_ARGS_DOC_METADATA, JSON_API_SERVICE_KEY } from '../constants';
import { JsonApiOptions } from '../types/options.interface';

const reqInject = Req();
const serviceInject = Inject(JsonApiService);

export const JsonApiFindById = <T>(
  modelName: string,
  paramKey = 'id',
  options?: JsonApiOptions,
): MethodDecorator => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const oldMethod: Function = descriptor.value;
    const index = oldMethod.length;
    reqInject(target, propertyKey, index);
    serviceInject(target, JSON_API_SERVICE_KEY);

    const paramIndex = Reflect.getMetadata(
      JSON_API_ARGS_DOC_METADATA,
      target,
      propertyKey,
    );

    descriptor.value = async function (...args: any) {
      const service: JsonApiService = this[JSON_API_SERVICE_KEY];
      const req: Request = args[index];
      const id = req.params[paramKey];
      let doc: JsonApiTopLevelObject<T>;

      try {
        doc = await service.findById(modelName, id, options);
        if (!doc.data) {
          throw new NotFoundException();
        }

        if (paramIndex !== undefined) {
          args[paramIndex] = doc;
        }

        const result = oldMethod.apply(this, args);
        doc = result !== undefined ? result : doc;
      } catch (error) {
        doc = service.hydrateTopDocument(undefined, [error], modelName);
        throw new HttpException(doc, error.status || 500);
      }

      return doc;
    };
  };

  return decorator;
};

export const JsonApiFind = <T>(
  modelName: string,
  options?: JsonApiOptions,
): MethodDecorator => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const oldMethod = descriptor.value;
    reqInject(target, propertyKey, 0);
    serviceInject(target, JSON_API_SERVICE_KEY);

    const paramIndex = Reflect.getMetadata(
      JSON_API_ARGS_DOC_METADATA,
      target,
      propertyKey,
    );

    descriptor.value = async function (...args: any) {
      const service: JsonApiService = this[JSON_API_SERVICE_KEY];
      const req: Request = args[0];
      let doc: JsonApiTopLevelObject<T>;

      try {
        doc = await service.find(modelName, req.query, options);

        if (paramIndex !== undefined) {
          args[paramIndex] = doc;
        }

        const result = oldMethod.apply(this, args);
        doc = result !== undefined ? result : doc;
      } catch (error) {
        doc = service.hydrateTopDocument(undefined, [error], modelName);
        throw new HttpException(doc, error.status || 500);
      }

      return doc;
    };
  };

  return decorator;
};

export const JsonApiCreate = <T>(
  modelName: string,
  options?: JsonApiOptions,
): MethodDecorator => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const oldMethod = descriptor.value;
    reqInject(target, propertyKey, 0);
    serviceInject(target, JSON_API_SERVICE_KEY);

    const paramIndex = Reflect.getMetadata(
      JSON_API_ARGS_DOC_METADATA,
      target,
      propertyKey,
    );

    descriptor.value = async function (...args: any) {
      const service: JsonApiService = this[JSON_API_SERVICE_KEY];
      const req: Request = args[0];
      let doc: JsonApiTopLevelObject<T>;

      try {
        doc = await service.create(
          modelName,
          req.body,
          options,
          service.getFullUrl(req),
        );

        if (paramIndex !== undefined) {
          args[paramIndex] = doc;
        }

        const result = oldMethod.apply(this, args);
        doc = result !== undefined ? result : doc;
      } catch (error) {
        doc = service.hydrateTopDocument(undefined, [error], modelName);
        throw new HttpException(doc, error.status || 500);
      }

      return doc;
    };
  };

  return decorator;
};

export const JsonApiUpdate = <T>(
  modelName: string,
  paramKey = 'id',
  options?: JsonApiOptions,
): MethodDecorator => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const oldMethod = descriptor.value;
    reqInject(target, propertyKey, 0);
    serviceInject(target, JSON_API_SERVICE_KEY);

    const paramIndex = Reflect.getMetadata(
      JSON_API_ARGS_DOC_METADATA,
      target,
      propertyKey,
    );

    descriptor.value = async function (...args: any) {
      const service: JsonApiService = this[JSON_API_SERVICE_KEY];
      const req: Request = args[0];
      const id = req.params[paramKey];
      let doc: JsonApiTopLevelObject<T>;

      try {
        doc = await service.update(modelName, id, req.body, options);
        if (!doc.data) {
          throw new NotFoundException();
        }

        if (paramIndex !== undefined) {
          args[paramIndex] = doc;
        }

        const result = oldMethod.apply(this, args);
        doc = result !== undefined ? result : doc;
      } catch (error) {
        doc = service.hydrateTopDocument(undefined, [error], modelName);
        throw new HttpException(doc, error.status || 500);
      }

      return doc;
    };
  };

  return decorator;
};

export const JsonApiDelete = (
  modelName: string,
  paramKey = 'id',
): MethodDecorator => {
  const decorator: MethodDecorator = (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const oldMethod = descriptor.value;
    reqInject(target, propertyKey, 0);
    serviceInject(target, JSON_API_SERVICE_KEY);

    const paramIndex = Reflect.getMetadata(
      JSON_API_ARGS_DOC_METADATA,
      target,
      propertyKey,
    );

    descriptor.value = async function (...args: any) {
      const service: JsonApiService = this[JSON_API_SERVICE_KEY];
      const req: Request = args[0];
      const id = req.params[paramKey];
      let doc: JsonApiTopLevelObject<void>;

      try {
        doc = await service.delete(modelName, id);
        if (!doc.meta?.count) {
          throw new NotFoundException();
        }

        if (paramIndex !== undefined) {
          args[paramIndex] = doc;
        }

        const result = oldMethod.apply(this, args);
        doc = result !== undefined ? result : doc;
      } catch (error) {
        doc = service.hydrateTopDocument(undefined, [error], modelName);
        throw new HttpException(doc, error.status || 500);
      }

      return doc;
    };
  };

  return decorator;
};

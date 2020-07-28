import { JSON_API_ARGS_DOC_METADATA } from '../constants';

export const JsonApiDoc = (): ParameterDecorator => (
  target: any,
  paramKey: string,
  index: number,
) => {
  Reflect.defineMetadata(JSON_API_ARGS_DOC_METADATA, index, target, paramKey);
};

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

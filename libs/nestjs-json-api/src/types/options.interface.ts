export interface JsonApiOptions {
  projection?: string;
  populate?: string | Array<string>;
  send?: boolean;
  catch?: boolean;
  parseQuery?: Function;
  parseObject?: Function;
}

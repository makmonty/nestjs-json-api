import { CollationOptions } from "mongoose";

export interface JsonApiOptions {
  projection?: string;
  populate?: string | Array<string>;
  collation?: CollationOptions;
  send?: boolean;
  catch?: boolean;
  parseQuery?: Function;
  parseObject?: Function;
}

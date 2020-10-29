import { JsonApiDatabaseAdapter } from '../types/database-adapter.interface';
import { JsonApiOptions } from '../types/options.interface';
import { Document, DocumentQuery } from 'mongoose';
import * as mongoose from 'mongoose';

export class JsonApiMongooseAdapter implements JsonApiDatabaseAdapter {
  async find(
    modelName: string,
    query: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<Array<any>> {
    const model = this.getModel(modelName);
    const dbQuery = model.find(query.filter, options?.projection);

    if (options?.populate) {
      this.populate(dbQuery, options.populate);
    }

    if (options?.collation) {
      dbQuery.collation(options.collation);
    }

    if (query.sort) {
      const fields: Array<string> = query.sort.split(',');
      const sort = {};
      fields.forEach((field) => {
        const order = field.charAt(0) === '-' ? -1 : 1;
        field = order === 1 ? field : field.substr(1);
        sort[field] = order;
      });
      dbQuery.sort(sort);
    }

    if (query.page) {
      const limit = query.page.limit || query.page.size;
      const offset = query.page.offset || (query.page.number - 1) * limit;
      dbQuery.limit(parseInt(limit, 10)).skip(parseInt(offset, 10));
    }

    if (options?.parseQuery) {
      options.parseQuery(dbQuery, query);
    }

    return await dbQuery.lean().exec();
  }

  async findById(
    modelName: string,
    id: string,
    options?: JsonApiOptions,
  ): Promise<any> {
    const model = this.getModel(modelName);
    const dbQuery = model.findById(id, options?.projection);

    if (options?.populate) {
      this.populate(dbQuery, options.populate);
    }

    if (options?.parseQuery) {
      options.parseQuery(dbQuery);
    }

    return await dbQuery.lean().exec();
  }

  async create<T>(
    modelName: string,
    body: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<T> {
    const model = this.getModel(modelName);
    const m = Object.assign({}, body);

    const objs = await model.create([m], { projection: options?.projection });
    let obj: Document = objs[0];
    if (options?.populate) {
      obj = await model.populate(obj, this.buildPopulateOpts(options.populate));
    }
    return obj.toObject();
  }

  async update<T>(
    modelName: string,
    id: string,
    body: Record<string, any>,
    options?: JsonApiOptions,
  ): Promise<T> {
    const model = this.getModel(modelName);
    const obj: Document = await model
      .findByIdAndUpdate(id, body, {
        // According to the Mongoose docs, this is supported.
        // But it's throwing compilation errors.
        // https://mongoosejs.com/docs/api.html#query_Query-setOptions
        // populate: options?.populate
        //   ? this.buildPopulateOpts(options.populate)
        //   : undefined,
        projection: options?.projection,
        new: true,
      })
      .exec();

    if (!obj) {
      return null;
    }

    Object.assign(obj, body);

    let newObj: Document = await obj.save();

    // Remove when populate option is supported
    if (options?.populate) {
      newObj = await model.populate(
        newObj,
        this.buildPopulateOpts(options?.populate),
      );
    }

    return newObj.toObject();
  }

  async delete(modelName: string, id: string) {
    const model = this.getModel(modelName);
    const result = await model.deleteOne({ _id: id } as any).exec();
    return result.deletedCount;
  }

  getId(obj: any) {
    return obj._id;
  }

  private getModel(modelName: string) {
    return mongoose.connections[1].model(modelName);
  }

  private populate(
    dbQuery: DocumentQuery<any, Document, {}>,
    populate: string | Array<string> | Array<Array<string>>,
  ) {
    const populateArr = this.buildPopulateOpts(populate);
    populateArr.forEach((popArr) => {
      dbQuery = dbQuery.populate(popArr);
    });
    return dbQuery;
  }

  private buildPopulateOpts(populate: any) {
    if (populate) {
      const populateArr = Array.isArray(populate) ? populate : [populate];
      return populateArr.map((pop) => {
        const popArray: Array<string> = Array.isArray(pop) ? pop : [pop];
        return { path: popArray[0], select: popArray[1] };
      });
    }
    return;
  }
}

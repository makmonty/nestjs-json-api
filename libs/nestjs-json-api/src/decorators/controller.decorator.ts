import {
  JsonApiFindById,
  JsonApiFind,
  JsonApiCreate,
  JsonApiUpdate,
  JsonApiDelete,
} from './method.decorator';
import { Get, Post, Patch, Delete } from '@nestjs/common';
import { JsonApiOptions } from '../types/options.interface';

const idKey = 'id';
const idParamKey = ':' + idKey;

export const JsonApiController = (
  modelName: string,
  options?: JsonApiOptions,
): any => {
  return function classDecorator<T extends { new (...args: any[]): {} }>(
    target: T,
  ) {
    // Solution 1: /:id shadows any other /whatever endpoint defined in the target
    // Look for a way to define the JsonApi endpoints after any other endpoint
    class JsonApiDecoratedController extends target {
      @Get(idParamKey)
      @JsonApiFindById(modelName, idKey, options)
      __jsonApiFindById() {
        return;
      }
      @Get()
      @JsonApiFind(modelName, options)
      __jsonApiFind() {
        return;
      }
      @Post()
      @JsonApiCreate(modelName, options)
      __jsonApiCreate() {
        return;
      }
      @Patch(idParamKey)
      @JsonApiUpdate(modelName, idKey, options)
      __jsonApiUpdate() {
        return;
      }
      @Delete(idParamKey)
      @JsonApiDelete(modelName, idKey)
      __jsonApiDelete() {
        return;
      }
    }
    return JsonApiDecoratedController;

    // Solution 2: The added methods are not reached by the router
    // Look for a way to define the methods and decorate them so that it works
    // Apparently, the decorator findByIdDec returns the descriptor,
    // but doesn't change the class. Using the latest defineProperty doesn't really work
    // @Controller(path)
    // class JsonApiDecoratedController extends target {}
    // JsonApiDecoratedController.prototype.jsonApiFindById = () => {return;};
    // findByIdDec(
    //   JsonApiDecoratedController,
    //   'jsonApiFindById',
    //   Object.getOwnPropertyDescriptor(JsonApiDecoratedController.prototype, 'jsonApiFindById')
    // );
    // return JsonApiDecoratedController;

    // Solution 3: Mixins https://www.typescriptlang.org/docs/handbook/mixins.html
    // Can't make it work
    // class JsonApiDecoratedController {
    //   // @JsonApiFindById(modelName)
    //   jsonApiFindById() {return;}
    //   // @JsonApiFind(modelName)
    //   jsonApiFind() {return;}
    // }
    // class Target extends target {}
    // @Controller(path)
    // class Pepe {}
    // interface Pepe extends Target, JsonApiDecoratedController {}
    // applyMixins(Pepe, [Target, JsonApiDecoratedController]);
    // findByIdDec(Pepe.prototype, 'jsonApiFindById', Object.getOwnPropertyDescriptor(Pepe.prototype, 'jsonApiFindById'));
    // return Pepe;

    // Object.assign(target.prototype, JsonApiDecoratedController.prototype);
    // class Test2 {
    //   @JsonApiFindById(modelName)
    //   jsonApiFindById() {return;}
    //   @JsonApiFind(modelName)
    //   jsonApiFind() {return;}
    // };
    // Test2.prototype = proto;
    // Test.prototype.jsonApiFindById = JsonApiDecoratedController.prototype.jsonApiFindById;

    // target.prototype.jsonApiFindById = JsonApiDecoratedController.prototype.jsonApiFindById;

    // const newClass = function() {return this;}
    // const newProto = Object.create(
    //   target.prototype,
    //   {
    //     jsonApiFindById: {value: JsonApiDecoratedController.prototype.jsonApiFindById}
    //   }
    // );
    // newClass.prototype = newProto;
    // console.log(newClass.prototype.jsonApiFindById);

    // Object.defineProperty(target.prototype, 'findById', {value: () => {}});

    // controllerDec(target);
    // findByIdDec(target, 'findById', Object.getOwnPropertyDescriptor(target.prototype, 'findById'));

    // return Test2;
    // return target;
  };
};

# NESTJS JSON API

A library to easily implement a JSON API in your NestJs application.

This library contains a set of decorators and a service to make everything easier.

## Installation

```
npm install nestjs-json-api
```

Or
```
yarn add nestjs-json-api
```

## Usage

First, import the `JsonApiModule` in your root module. You'll have to setup the database connection independently.

Example with Mongoose:

```
@Module({
  ...
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/dbname'),
    JsonApiModule.forRoot({
      adapter: JsonApiMongooseAdapter,
    }),
  ],
  ...
})
export class AppModule {}
```

Now you can use the decorators. The recommended way is to use the method decorators

Example with a user controller:

```
@Controller('user')
class UserController {
  @Get(':id')
  @JsonApiFindById('UserModel')
  findById(@JsonApiDoc doc: JsonApiTopLevelObject<User>) {
    // Do stuff with the doc
    return doc;
  }

  @Get()
  @JsonApiFind('UserModel')
  find(@JsonApiDoc doc: JsonApiTopLevelObject<User[]>) {
    // Do stuff with the doc
    return doc;
  }

  @Post()
  @JsonApiCreate('UserModel')
  create(@JsonApiDoc doc: JsonApiTopLevelObject<User>) {
    // Do stuff with the doc
    return doc;
  }

  @Patch(':id')
  @JsonApiUpdate('UserModel')
  update(@JsonApiDoc doc: JsonApiTopLevelObject<User>) {
    // Do stuff with the doc
    return doc;
  }
  
  @Delete(idParamKey)
  @JsonApiDelete('UserModel')
  delete() {
    return;
  }
}
```

If you want to quickly get it working, you can use the `JsonApiController` decorator on your controller. The downside is that you won't have control over the endpoints.

Example:

```
@Controller('categories')
@JsonApiController('CategoryModel')
export class CategoriesController {}
```


## TODO

* Improve docs

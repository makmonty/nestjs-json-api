import { Module } from '@nestjs/common';
import { JsonApiService } from './services/json-api.service';
import { JsonApiDatabaseAdapter } from './types/database-adapter.interface';

export interface JsonApiConfiguration {
  adapter: new () => JsonApiDatabaseAdapter;
  jvTag?: string;
}

@Module({})
export class JsonApiModule {
  static forRoot(config: JsonApiConfiguration) {
    return {
      global: true,
      module: JsonApiModule,
      providers: [
        JsonApiService,
        {
          provide: 'JSON_API_DATABASE_ADAPTER',
          useClass: config.adapter,
        },
        {
          provide: 'JSON_API_JV_TAG',
          useValue: config.jvTag || '_jv',
        },
      ],
      exports: [JsonApiService],
    };
  }
}

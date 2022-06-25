import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import customConfig from './config';
import {MyLoggerModule} from "./common/my-logger/my-logger.module";
import {ThrottlerModule} from "@nestjs/throttler";
import {UniversitiesModule} from "./modules/universities/universities.module";
import {APP_FILTER} from "@nestjs/core";
import { AllExceptionsFilter } from './common/filters';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [customConfig],
    }),
    MyLoggerModule,
    UniversitiesModule
  ],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },],
})
export class AppModule {}

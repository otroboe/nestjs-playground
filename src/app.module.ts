import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { FakerModule } from './faker/faker.module';
import { FixturesModule } from './fixtures/fixtures.module';
import { LocationModule } from './location/location.module';
import { LocationController } from './location/location.controller';
import { LoggerMiddleWare } from './common/middlewares/logger.middleware';
import { MovieController } from './location/movie.controller';

@Module({
  imports: [
    FakerModule,
    FixturesModule,
    LocationModule,
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleWare)
      .with('ApplicationModule')
      .forRoutes(LocationController, MovieController);
  }
}

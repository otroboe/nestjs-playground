import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { locationProviders } from './providers/location.providers';
import { LocationController } from './location.controller';
import { LocationService } from './services/location.service';
import { LocationTransformer } from './transformers/location.transformer';
import { movieProviders } from './providers/movie.providers';
import { MovieController } from './movie.controller';
import { MovieService } from './services/movie.service';
import { MovieTransformer } from './transformers/movie.transformer';
import { scheduleProviders } from './providers/schedule.providers';
import { ScheduleService } from './services/schedule.service';
import { ScheduleTransformer } from './transformers/schedule.transformer';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    LocationController,
    MovieController,
  ],
  providers: [
    ...locationProviders,
    LocationService,
    LocationTransformer,
    ...movieProviders,
    MovieService,
    MovieTransformer,
    ...scheduleProviders,
    ScheduleService,
    ScheduleTransformer,
  ],
  exports: [
    LocationService,
    MovieService,
    ScheduleService,
  ],
})
export class LocationModule {}

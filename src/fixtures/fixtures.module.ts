import { Module } from '@nestjs/common';

import { FakerModule } from '../faker/faker.module';
import { FixturesService } from './fixtures.service';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    FakerModule,
    LocationModule,
  ],
  providers: [
    FixturesService,
  ],
})
export class FixturesModule {}

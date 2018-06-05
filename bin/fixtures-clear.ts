/* tslint:disable:no-console */

import { NestFactory } from '@nestjs/core';

import { ApplicationModule } from '../src/app.module';
import { FixturesModule } from '../src/fixtures/fixtures.module';
import { FixturesService } from '../src/fixtures/fixtures.service';

// Create an execution context of the app
(async () => {
  const context = await NestFactory.createApplicationContext(ApplicationModule);

  const fixturesModule = await context.select<FixturesModule>(FixturesModule);
  const fixturesService = await fixturesModule.get<FixturesService>(FixturesService);

  await fixturesService.clear();
})()
.then(() => {
  console.log(`All fixtures have been deleted from the database.`);

  process.exit(0);
})
.catch(error => {
  console.log(error);
});

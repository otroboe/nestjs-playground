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

  const locationList = await fixturesService.injectLocations();
  const movieList = await fixturesService.injectMovies();
  const scheduleList = await fixturesService.injectSchedules(locationList, movieList);

  console.log(`- ${locationList.length} locations have been inserted in the database.`);
  console.log(`- ${movieList.length} movies have been inserted in the database.`);
  console.log(`- ${scheduleList.length} schedules have been inserted in the database.`);
})()
.then(() => {
  console.log(`Success!`);

  process.exit(0);
})
.catch(error => {
  console.log(error);
});

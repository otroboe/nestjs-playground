/* tslint:disable:no-console */

import * as express from 'express';
import * as moment from 'moment';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, INestApplicationContext } from '@nestjs/common';

import { FixturesModule } from '../../src/fixtures/fixtures.module';
import { FixturesService } from '../../src/fixtures/fixtures.service';
import { Location } from '../../src/location/entities/location.entity';
import { LocationModule } from '../../src/location/location.module';
import { Movie } from '../../src/location/entities/movie.entity';

describe('Locations', () => {
  let server;
  let app: INestApplication;
  let fixturesModule: INestApplicationContext;
  let fixturesService: FixturesService;

  // Bootstrap the server and app
  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [
        FixturesModule,
        LocationModule,
      ],
    }).compile();

    fixturesModule = testingModule.select<FixturesModule>(FixturesModule);
    fixturesService = fixturesModule.get<FixturesService>(FixturesService);

    server = express();

    app = testingModule.createNestApplication(server);

    await app.init();
  });

  afterEach(() => {
    return fixturesService.clear();
  });

  describe('GET /unknown', () => {
    it('Should get a 404 for an unknown route', () => {
      return request(server)
        .get('/unknown')
        .expect(404);
    });
  });

  describe('GET /locations', () => {
    it('Should get an empty list', () => {
      return request(server)
        .get('/locations')
        .expect(200)
        .expect([]);
    });

    it('Should get the right amount of location and the right props for each object', async () => {
      await fixturesService.injectLocations();

      await request(server)
        .get('/locations')
        .expect(200)
        .expect(response => {
          expect(response.body instanceof Array).toBe(true);
          expect(response.body.length).toBe(fixturesService.locationRawData.length);

          response.body.forEach(data => {
            expect(Object.keys(data)).toEqual(['id', 'name']);
          });
        });
    });
  });

  describe('GET /locations/{id}', () => {
    it('Should get a 404 error if the ID is not found', () => {
      return request(server)
        .get('/locations/not-an-id')
        .expect(404)
        .expect(response => {
          expect(response.body.statusCode).toBe(404);
          expect(response.body.message).toBe('This location doesn\'t exist');
        });
    });

    it('Should get the right location data', async () => {
      const locationList: Location[] = await fixturesService.injectLocations();
      const location: Location = locationList.pop();

      await request(server)
        .get(`/locations/${location.id}`)
        .expect(200)
        .expect(response => {
          expect(Object.keys(response.body)).toEqual(['name', 'address', 'phone', 'latitude', 'longitude']);
          expect(response.body.name).toBe(location.name);
          expect(response.body.address).toBe(location.address);
          expect(response.body.phone).toBe(location.phone);

          // The lat & long are formatted in the DB with 8 numbers after decimal
          // Somehow the fixtures service only returning a parsed number (removing useless 0 numbers at the end)
          expect(response.body.latitude).toBe(parseFloat(location.latitude.toString()).toFixed(8));
          expect(response.body.longitude).toBe(parseFloat(location.longitude.toString()).toFixed(8));
        });
    });
  });

  describe('GET /locations/{id}/schedules', () => {
    it('Should get a 404 error if the ID is not found', () => {
      return request(server)
        .get('/locations/not-an-id/schedules')
        .expect(404)
        .expect(response => {
          expect(response.body.statusCode).toBe(404);
          expect(response.body.message).toBe('This location doesn\'t exist');
        });
    });

    it('Should get some schedules with future dates', async () => {
      const locationList: Location[] = await fixturesService.injectLocations();
      const location: Location = locationList.pop();

      const movieList: Movie[] = await fixturesService.injectMovies();
      await fixturesService.injectSchedules([location], movieList);

      await request(server)
        .get(`/locations/${location.id}/schedules`)
        .expect(200)
        .expect(response => {
          expect(response.body instanceof Array).toBe(true);

          response.body.forEach(data => {
            expect(Object.keys(data)).toEqual(['startAt', 'type', 'movie']);

            expect(moment().isBefore(new Date(data.startAt))).toEqual(true);
            expect(fixturesService.scheduleTypeList.indexOf(data.type)).not.toEqual(-1);
            expect(Object.keys(data.movie)).toEqual(['uuid']);
          });
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

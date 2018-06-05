import { Test } from '@nestjs/testing';

import { locationData } from '../../fixtures/data/locations.data';
import { Location } from '../entities/location.entity';
import { LocationTransformer } from './location.transformer';

const buildLocationList = (rawDataList: object[]): Location[] => {
  const output = [];
  let location;

  rawDataList.forEach((data: object, index: number) => {
    location = new Location();
    location.id = index;
    Object.assign(location, data);
    output.push(location);
  });

  return output;
};

describe('LocationTransformer', () => {
  const locationRawData: object[] = locationData;
  let locationTransformer: LocationTransformer;
  let locationList: Location[];

  beforeAll(() => {
    locationList = buildLocationList(locationRawData);
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocationTransformer,
      ],
    }).compile();

    locationTransformer = module.get<LocationTransformer>(LocationTransformer);
  });

  describe('transformList', () => {
    it('Should transform properly locations with right properties', () => {
      const result = locationTransformer.transformList(locationList);

      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(locationList.length);

      result.forEach(item => {
        expect(Object.keys(item)).toEqual(['id', 'name']);
      });
    });
  });

  describe('transform', () => {
    it('Should transform properly location with right properties', () => {
      const result = locationTransformer.transformOne(locationList[0]);

      expect(Object.keys(result)).toEqual(['name', 'address', 'phone', 'latitude', 'longitude']);
    });
  });
});

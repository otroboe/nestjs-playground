import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import { constants } from '../../constants';
import { Location } from '../entities/location.entity';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let locationRepository: Repository<Location>;
  let locationService: LocationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: constants.TOKEN_REPO_LOCATION,
          useClass: Repository,
        },
        LocationService,
      ],
    }).compile();

    locationRepository = module.get(constants.TOKEN_REPO_LOCATION);
    locationService = module.get<LocationService>(LocationService);
  });

  describe('find', () => {
    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(locationRepository, 'find').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(locationService.find()).rejects.toEqual(new Error('My Error'));
      expect(locationRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Should resolves if repository resolves', async () => {
      jest.spyOn(locationRepository, 'find').mockImplementation(() => Promise.resolve(['location1', 'location2']));

      await expect(locationService.find()).resolves.toEqual(['location1', 'location2']);
      expect(locationRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(locationRepository, 'findOne').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(locationService.findOne('my-id')).rejects.toEqual(new Error('My Error'));
      expect(locationRepository.findOne).toHaveBeenCalledWith('my-id', {
        relations: ['schedules'],
      });
    });

    it('Should resolves if repository resolves', async () => {
      jest.spyOn(locationRepository, 'findOne').mockImplementation(() => Promise.resolve(['location1', 'location2']));

      await expect(locationService.findOne('my-id')).resolves.toEqual(['location1', 'location2']);
      expect(locationRepository.findOne).toHaveBeenCalledWith('my-id', {
        relations: ['schedules'],
      });
    });
  });

  describe('create', () => {
    const rawData = {
      test: 'original-data',
    };
    const location = {
      test: 'my-location',
    };

    beforeEach(() => {
      jest.spyOn(locationRepository, 'create').mockImplementation(() => location);
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(locationRepository, 'save').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(locationService.create(rawData)).rejects.toEqual(new Error('My Error'));
      expect(locationRepository.create).toHaveBeenCalledWith(rawData);
      expect(locationRepository.save).toHaveBeenCalledWith(location);
    });

    it('Should resolves if repository resolves', async () => {
      jest.spyOn(locationRepository, 'save').mockImplementation(() => Promise.resolve('location1'));

      await expect(locationService.create(rawData)).resolves.toEqual('location1');
      expect(locationRepository.create).toHaveBeenCalledWith(rawData);
      expect(locationRepository.save).toHaveBeenCalledWith(location);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      jest.spyOn(locationRepository, 'find').mockImplementation(() => Promise.resolve(['location1', 'location2']));
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(locationRepository, 'remove').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(locationService.clear()).rejects.toEqual(new Error('My Error'));
      expect(locationRepository.remove).toHaveBeenCalledTimes(2);
    });

    it('Should resolved if repository resolves', async () => {
      jest.spyOn(locationRepository, 'remove').mockImplementation(() => Promise.resolve(true));

      await expect(locationService.clear()).resolves.toEqual(undefined);
      expect(locationRepository.remove).toHaveBeenCalledTimes(2);
    });
  });
});

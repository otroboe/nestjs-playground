import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { constants } from '../constants';
import { LocationController } from './location.controller';
import { LocationService } from './services/location.service';
import { LocationTransformer } from './transformers/location.transformer';
import { MovieTransformer } from './transformers/movie.transformer';
import { ScheduleService } from './services/schedule.service';
import { ScheduleTransformer } from './transformers/schedule.transformer';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;
  let locationTransformer: LocationTransformer;
  let scheduleService: ScheduleService;
  let scheduleTransformer: ScheduleTransformer;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [
        LocationController,
      ],
      providers: [
        LocationService,
        {
          provide: constants.TOKEN_REPO_LOCATION,
          useClass: Repository,
        },
        LocationTransformer,
        ScheduleService,
        {
          provide: constants.TOKEN_REPO_SCHEDULE,
          useClass: Repository,
        },
        ScheduleTransformer,
        MovieTransformer,
      ],
    }).compile();

    locationController = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
    locationTransformer = module.get<LocationTransformer>(LocationTransformer);

    scheduleService = module.get<ScheduleService>(ScheduleService);
    scheduleTransformer = module.get<ScheduleTransformer>(ScheduleTransformer);
  });

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const result = ['location1', 'location2'];
      const propList = 'fake';

      jest.spyOn(locationService, 'find').mockImplementation(() => Promise.resolve(result));
      jest.spyOn(locationTransformer, 'transformList').mockImplementation(list => list);

      await expect(locationController.findAll(propList)).resolves.toEqual(result);

      expect(locationService.find).toHaveBeenCalledTimes(1);
      expect(locationTransformer.transformList).toHaveBeenCalledWith(result, propList);
    });
  });

  describe('findOne', () => {
    it('should throw an exception if no location found', async () => {
      jest.spyOn(locationService, 'findOne').mockImplementation(() => Promise.resolve());
      jest.spyOn(locationTransformer, 'transformOne').mockImplementation(jest.fn());

      await expect(locationController.findOne('test-id')).rejects.toEqual(new HttpException('This location doesn\'t exist', HttpStatus.NOT_FOUND));

      expect(locationService.findOne).toHaveBeenCalledWith('test-id');
      expect(locationTransformer.transformOne).not.toHaveBeenCalled();
    });

    it('should return a location if exists', async () => {
      const location = {
        id: 'test-id',
      };
      const transformedLocation = {
        id: 'test-id',
        name: 'my-test',
      };

      jest.spyOn(locationService, 'findOne').mockImplementation(() => Promise.resolve(location));
      jest.spyOn(locationTransformer, 'transformOne').mockImplementation(() => transformedLocation);

      await expect(locationController.findOne('test-id')).resolves.toEqual(transformedLocation);

      expect(locationService.findOne).toHaveBeenCalledWith('test-id');
      expect(locationTransformer.transformOne).toHaveBeenCalledWith(location);
    });
  });

  describe('findAllSchedule', () => {
    it('should throw an exception if no location found', async () => {
      jest.spyOn(locationService, 'findOne').mockImplementation(() => Promise.resolve());
      jest.spyOn(scheduleService, 'findByLocation').mockImplementation(jest.fn());
      jest.spyOn(scheduleTransformer, 'transformList').mockImplementation(jest.fn());

      await expect(locationController.findAllSchedule('test-id')).rejects
        .toEqual(new HttpException('This location doesn\'t exist', HttpStatus.NOT_FOUND));

      expect(locationService.findOne).toHaveBeenCalledWith('test-id');
      expect(scheduleService.findByLocation).not.toHaveBeenCalled();
      expect(scheduleTransformer.transformList).not.toHaveBeenCalled();
    });

    it('should return the schedules of the location', async () => {
      const location = {
        id: 'test-id',
      };
      const schedules = ['schedule1', 'schedule2'];
      const transformedSchedules = [{ name: 'schedule1' }, { name: 'schedule2'}];

      jest.spyOn(locationService, 'findOne').mockImplementation(() => Promise.resolve(location));
      jest.spyOn(scheduleService, 'findByLocation').mockImplementation(() => Promise.resolve(schedules));
      jest.spyOn(scheduleTransformer, 'transformList').mockImplementation(() => Promise.resolve(transformedSchedules));

      await expect(locationController.findAllSchedule('test-id')).resolves.toEqual(transformedSchedules);

      expect(locationService.findOne).toHaveBeenCalledWith('test-id');
      expect(scheduleService.findByLocation).toHaveBeenCalledWith(location);
      expect(scheduleTransformer.transformList).toHaveBeenCalledWith(schedules);
    });
  });
});

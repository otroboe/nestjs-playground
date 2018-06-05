import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import { constants } from '../../constants';
import { Location } from '../entities/location.entity';
import { Schedule } from '../entities/schedule.entity';
import { ScheduleService } from './schedule.service';

describe('ScheduleService', () => {
  let scheduleRepository: Repository<Schedule>;
  let scheduleService: ScheduleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: constants.TOKEN_REPO_SCHEDULE,
          useClass: Repository,
        },
        ScheduleService,
      ],
    }).compile();

    scheduleRepository = module.get(constants.TOKEN_REPO_SCHEDULE);
    scheduleService = module.get<ScheduleService>(ScheduleService);
  });

  describe('findByLocation', () => {
    let location: Location;
    let queryBuilderMock: any;

    beforeEach(() => {
      location = new Location();
      location.id = 1;

      queryBuilderMock = {
        leftJoinAndSelect: jest.fn(),
        where: jest.fn(),
        orderBy: jest.fn(),
        getMany: jest.fn(),
      };
    });

    it('Should call every querybuilder methods', async () => {
      jest.spyOn(scheduleRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock);
      jest.spyOn(queryBuilderMock, 'leftJoinAndSelect').mockReturnThis();
      jest.spyOn(queryBuilderMock, 'where').mockReturnThis();
      jest.spyOn(queryBuilderMock, 'orderBy').mockReturnThis();
      jest.spyOn(queryBuilderMock, 'getMany').mockReturnValue(Promise.resolve([]));

      await expect(scheduleService.findByLocation(location)).resolves.toEqual([]);
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.orderBy).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.getMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    const rawData = {
      test: 'original-data',
    };
    const schedule = {
      test: 'my-schedule',
    };

    beforeEach(() => {
      jest.spyOn(scheduleRepository, 'create').mockImplementation(() => schedule);
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(scheduleRepository, 'save').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(scheduleService.create(rawData)).rejects.toEqual(new Error('My Error'));
      expect(scheduleRepository.create).toHaveBeenCalledWith(rawData);
      expect(scheduleRepository.save).toHaveBeenCalledWith(schedule);
    });

    it('Should resolves if repository resolves', async () => {
      jest.spyOn(scheduleRepository, 'save').mockImplementation(() => Promise.resolve('schedule1'));

      await expect(scheduleService.create(rawData)).resolves.toEqual('schedule1');
      expect(scheduleRepository.create).toHaveBeenCalledWith(rawData);
      expect(scheduleRepository.save).toHaveBeenCalledWith(schedule);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      jest.spyOn(scheduleRepository, 'find').mockImplementation(() => Promise.resolve(['schedule1', 'schedule2']));
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(scheduleRepository, 'remove').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(scheduleService.clear()).rejects.toEqual(new Error('My Error'));
      expect(scheduleRepository.find).toHaveBeenCalledTimes(1);
      expect(scheduleRepository.remove).toHaveBeenCalledTimes(2);
    });

    it('Should resolved if repository resolves', async () => {
      jest.spyOn(scheduleRepository, 'remove').mockImplementation(() => Promise.resolve(true));

      await expect(scheduleService.clear()).resolves.toEqual(undefined);
      expect(scheduleRepository.find).toHaveBeenCalledTimes(1);
      expect(scheduleRepository.remove).toHaveBeenCalledTimes(2);
    });
  });
});

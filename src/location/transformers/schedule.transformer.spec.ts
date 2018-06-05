import { Test } from '@nestjs/testing';

import { MovieTransformer } from './movie.transformer';
import { Schedule } from '../entities/schedule.entity';
import { ScheduleTransformer } from './schedule.transformer';
import { Location } from '../entities/location.entity';
import { Movie } from '../entities/movie.entity';
import { MovieResponse } from '../swagger/movie.response';
import { ScheduleListResponse } from '../swagger/schedule.list.response';

const buildScheduleList = (amount = 1): Schedule[] => {
  let schedule: Schedule;
  let startAt: Date;

  return Array(amount).fill(0).map((_val: any, index: number) => {
    schedule = new Schedule();
    startAt = new Date();
    startAt.setHours(10 + index, 0, 0, 0);

    Object.assign(schedule, {
      id: index,
      startAt,
      type: 'normal',
      location: new Location(),
      movie: new Movie(),
    });

    return schedule;
  });
};

describe('ScheduleTransformer', () => {
  let movieTransformer: MovieTransformer;
  let scheduleTransformer: ScheduleTransformer;
  let scheduleList: Schedule[];

  beforeAll(() => {
    scheduleList = buildScheduleList(14);
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MovieTransformer,
        ScheduleTransformer,
      ],
    }).compile();

    movieTransformer = module.get<MovieTransformer>(MovieTransformer);
    scheduleTransformer = module.get<ScheduleTransformer>(ScheduleTransformer);
  });

  describe('transformList', () => {
    it('Should transform properly schedules with right properties and dates', () => {
      jest.spyOn(movieTransformer, 'transformOneForSchedule').mockImplementation(() => new MovieResponse());

      const result = scheduleTransformer.transformList(scheduleList);

      expect(movieTransformer.transformOneForSchedule).toHaveBeenCalledTimes(scheduleList.length);
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(scheduleList.length);

      result.forEach((item: ScheduleListResponse) => {
        expect(Object.keys(item)).toEqual(['startAt', 'type', 'movie']);
      });
    });
  });
});

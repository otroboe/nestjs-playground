import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { constants } from '../../constants';
import { Location } from '../entities/location.entity';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ScheduleService {

  constructor(
    @Inject(constants.TOKEN_REPO_SCHEDULE)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  public async findByLocation(location: Location): Promise<Schedule[]> {
    return this.scheduleRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.movie', 'movie')
      .where('schedule.locationId = :id', { id: location.id })
      .orderBy('schedule.startAt')
      .getMany();
  }

  public async create(rawData: object): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(rawData);

    return this.scheduleRepository.save(schedule);
  }

  public async clear(): Promise<void> {
    return this.scheduleRepository.find()
      .then(async (schedules) => {
        await Promise.all(schedules.map(schedule => this.scheduleRepository.remove(schedule)));
      });
  }
}

import * as _ from 'lodash';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

import { Schedule } from '../entities/schedule.entity';
import { ScheduleListResponse } from '../swagger/schedule.list.response';
import { MovieTransformer } from './movie.transformer';

@Injectable()
export class ScheduleTransformer {
  constructor(
    private readonly movieTransformer: MovieTransformer,
  ) {}

  public transformList(list: Schedule[]): ScheduleListResponse[] {
    return list.map((schedule: Schedule) => {
      return {
        startAt: this.transformStartDate(schedule.startAt),
        ..._.pick(schedule, ['type']),
        movie: this.movieTransformer.transformOneForSchedule(schedule.movie),
      };
    });
  }

  /**
   * Always generate a fake datetime, for the next week.
   */
  private transformStartDate(date: Date): string {
    const dayOfWeek = moment(date).isoWeekday();
    const hour = moment(date).hour();
    const min = moment(date).minute();

    // Rebuild a date
    const dateNextWeek = moment()
      .startOf('isoWeek')
      .isoWeekday(dayOfWeek)
      .add(1, 'week')
      .hour(hour)
      .minute(min)
      .toDate();

    return dateNextWeek.toString();
  }
}

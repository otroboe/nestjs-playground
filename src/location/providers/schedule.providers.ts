import { Connection, Repository } from 'typeorm';

import { constants } from '../../constants';
import { Schedule } from '../entities/schedule.entity';

export const scheduleProviders = [
  {
    provide: constants.TOKEN_REPO_SCHEDULE,
    useFactory: (connection: Connection): Repository<Schedule> => connection.getRepository(Schedule),
    inject: [
      constants.TOKEN_DB_CONNECTION,
    ],
  },
];

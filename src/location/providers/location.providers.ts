import { Connection, Repository } from 'typeorm';

import { constants } from '../../constants';
import { Location } from '../entities/location.entity';

export const locationProviders = [
  {
    provide: constants.TOKEN_REPO_LOCATION,
    useFactory: (connection: Connection): Repository<Location> => connection.getRepository(Location),
    inject: [
      constants.TOKEN_DB_CONNECTION,
    ],
  },
];

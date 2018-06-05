import { Connection, Repository } from 'typeorm';

import { Movie } from '../entities/movie.entity';
import { constants } from '../../constants';

export const movieProviders = [
  {
    provide: constants.TOKEN_REPO_MOVIE,
    useFactory: (connection: Connection): Repository<Movie> => connection.getRepository(Movie),
    inject: [
      constants.TOKEN_DB_CONNECTION,
    ],
  },
];

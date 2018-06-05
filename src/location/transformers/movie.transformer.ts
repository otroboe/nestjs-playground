import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';

import { Movie } from '../entities/movie.entity';
import { MovieResponse } from '../swagger/movie.response';
import { MovieScheduleResponse } from '../swagger/movieSchedule.response';

@Injectable()
export class MovieTransformer {
  public transformOne(movie: Movie, baseUrl: string): MovieResponse {
    return Object.assign({}, _.pick(movie, ['title', 'imdb']), {
      poster: `${baseUrl}${movie.poster}`,
    });
  }

  public transformOneForSchedule(movie: Movie): MovieScheduleResponse {
    return _.pick(movie, ['uuid']);
  }
}

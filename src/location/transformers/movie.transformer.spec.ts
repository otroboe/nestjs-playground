import { Test } from '@nestjs/testing';

import { Movie } from '../entities/movie.entity';
import { MovieTransformer } from './movie.transformer';

describe('MovieTransformer', () => {
  let movieTransformer: MovieTransformer;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MovieTransformer,
      ],
    }).compile();

    movieTransformer = module.get<MovieTransformer>(MovieTransformer);
  });

  describe('transformOneForSchedule', () => {
    let movie: Movie;

    beforeAll(() => {
      movie = new Movie();
      movie.id = 1;
      movie.uuid = 'uuid';
    });

    it('Should transform properly movie with right properties', () => {
      const result = movieTransformer.transformOneForSchedule(movie);

      expect(Object.keys(result)).toEqual(['uuid']);
    });
  });
});

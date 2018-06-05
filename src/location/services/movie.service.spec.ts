import { Repository } from 'typeorm';
import { Test } from '@nestjs/testing';

import { constants } from '../../constants';
import { Movie } from '../entities/movie.entity';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let movieRepository: Repository<Movie>;
  let movieService: MovieService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: constants.TOKEN_REPO_MOVIE,
          useClass: Repository,
        },
        MovieService,
      ],
    }).compile();

    movieRepository = module.get(constants.TOKEN_REPO_MOVIE);
    movieService = module.get<MovieService>(MovieService);
  });

  describe('create', () => {
    const rawData = {
      test: 'original-data',
    };
    const movie = {
      test: 'my-movie',
    };

    beforeEach(() => {
      jest.spyOn(movieRepository, 'create').mockImplementation(() => movie);
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(movieRepository, 'save').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(movieService.create(rawData)).rejects.toEqual(new Error('My Error'));
      expect(movieRepository.create).toHaveBeenCalledWith(rawData);
      expect(movieRepository.save).toHaveBeenCalledWith(movie);
    });

    it('Should resolves if repository resolves', async () => {
      jest.spyOn(movieRepository, 'save').mockImplementation(() => Promise.resolve('movie1'));

      await expect(movieService.create(rawData)).resolves.toEqual('movie1');
      expect(movieRepository.create).toHaveBeenCalledWith(rawData);
      expect(movieRepository.save).toHaveBeenCalledWith(movie);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      jest.spyOn(movieRepository, 'find').mockImplementation(() => Promise.resolve(['movie1', 'movie2']));
    });

    it('Should rejects if repository throw an error', async () => {
      jest.spyOn(movieRepository, 'remove').mockImplementation(() => Promise.reject(new Error('My Error')));

      await expect(movieService.clear()).rejects.toEqual(new Error('My Error'));
      expect(movieRepository.find).toHaveBeenCalledTimes(1);
      expect(movieRepository.remove).toHaveBeenCalledTimes(2);
    });

    it('Should resolved if repository resolves', async () => {
      jest.spyOn(movieRepository, 'remove').mockImplementation(() => Promise.resolve(true));

      await expect(movieService.clear()).resolves.toEqual(undefined);
      expect(movieRepository.find).toHaveBeenCalledTimes(1);
      expect(movieRepository.remove).toHaveBeenCalledTimes(2);
    });
  });
});

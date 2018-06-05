import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { constants } from '../../constants';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieService {

  constructor(
    @Inject(constants.TOKEN_REPO_MOVIE)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  public async find(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  public async findOneByUuid(uuid: string): Promise<Movie> {
    return this.movieRepository.findOne({ uuid });
  }

  public async create(rawData: object): Promise<Movie> {
    const movie = this.movieRepository.create(rawData);

    return this.movieRepository.save(movie);
  }

  public async clear(): Promise<void> {
    return this.movieRepository.find()
      .then(async (movies) => {
        await Promise.all(movies.map(movie => this.movieRepository.remove(movie)));
      });
  }
}

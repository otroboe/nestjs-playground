import * as url from 'url';
import { Controller, Get, HttpException, HttpStatus, Param, Req } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

// import { Movie } from './entities/movie.entity';
import { MovieResponse } from './swagger/movie.response';
import { MovieService } from './services/movie.service';
import { MovieTransformer } from './transformers/movie.transformer';

@Controller('movies')
@ApiUseTags('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly movieTransformer: MovieTransformer,
  ) {}

  private getBaseUrl(request: Request): string {
    return url.format({
      protocol: request.protocol,
      host: request.get('host'),
    });
  }

  // @Get('/dump')
  // async findAll(@Req() request: Request): Promise<MovieResponse[]> {
  //   const baseUrl = this.getBaseUrl(request);

  //   return this.movieService.find()
  //     .then((list: Movie[]) => list.map(movie => this.movieTransformer.transformOne(movie, baseUrl)));
  // }

  @Get(':uuid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Complete informations about a movie',
    type: MovieResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The movie doesn\'t exist',
  })
  async findOne(@Param('uuid') uuid: string, @Req() request: Request): Promise<MovieResponse> {
    return this.movieService.findOneByUuid(uuid)
      .then(movie => {
        if (movie === undefined) {
          throw new HttpException('This movie doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        return this.movieTransformer.transformOne(movie, this.getBaseUrl(request));
      });
  }
}

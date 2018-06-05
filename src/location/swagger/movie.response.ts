import { ApiModelProperty } from '@nestjs/swagger';

export class MovieResponse {
  @ApiModelProperty({ description: 'International title'})
  title: string;

  @ApiModelProperty({ description: 'IMDB key'})
  imdb: string;

  @ApiModelProperty({ description: 'URL of the poster' })
  poster: string;
}

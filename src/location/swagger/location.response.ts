import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class LocationResponse {
  @ApiModelProperty({ description: 'Unique ID'})
  public id?: number;

  @ApiModelProperty({ description: 'Name of the movie theater'})
  public name?: string;

  @ApiModelProperty({ description: 'Full address' })
  public address?: string;

  @ApiModelPropertyOptional({ description: 'Phone number' })
  public phone?: string;

  @ApiModelPropertyOptional()
  public latitude?: number;

  @ApiModelPropertyOptional()
  public longitude?: number;
}

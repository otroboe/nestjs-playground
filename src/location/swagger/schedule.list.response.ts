import { ApiModelProperty } from '@nestjs/swagger';

import { MovieScheduleResponse } from './movieSchedule.response';

export class ScheduleListResponse {
  @ApiModelProperty({ type: 'string', description: 'ISO 8601 format' })
  startAt: string;

  @ApiModelProperty({ description: 'regular | 3d | imax' })
  type: string;

  @ApiModelProperty()
  movie: MovieScheduleResponse;
}

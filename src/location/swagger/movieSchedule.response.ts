import { ApiModelProperty } from '@nestjs/swagger';

export class MovieScheduleResponse {
  @ApiModelProperty()
  uuid: string;
}

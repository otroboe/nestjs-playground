import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';

import { Location } from './entities/location.entity';
import { LocationResponse } from './swagger/location.response';
import { LocationService } from './services/location.service';
import { LocationTransformer } from './transformers/location.transformer';
import { Schedule } from './entities/schedule.entity';
import { ScheduleListResponse } from './swagger/schedule.list.response';
import { ScheduleService } from './services/schedule.service';
import { ScheduleTransformer } from './transformers/schedule.transformer';

@Controller('locations')
@ApiUseTags('locations')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly locationTransformer: LocationTransformer,
    private readonly scheduleService: ScheduleService,
    private readonly scheduleTransformer: ScheduleTransformer,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of available movie theaters',
    type: LocationResponse,
    isArray: true,
  })
  async findAll(@Query('props') props: string): Promise<LocationResponse[]> {
    return this.locationService.find()
      .then((list: Location[]) => this.locationTransformer.transformList(list, props));
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Complete informations about a movie theater',
    type: LocationResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The location doesn\'t exist',
  })
  async findOne(@Param('id') id: string): Promise<LocationResponse> {
    return this.locationService.findOne(id)
      .then(location => {
        if (location === undefined) {
          throw new HttpException('This location doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        return this.locationTransformer.transformOne(location);
      });
  }

  @Get(':id/schedules')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scheduled movies for a location',
    type: ScheduleListResponse,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The location doesn\'t exist',
  })
  async findAllSchedule(@Param('id') id: string): Promise<ScheduleListResponse[]> {
    return this.locationService.findOne(id)
      .then(location => {
        if (location === undefined) {
          throw new HttpException('This location doesn\'t exist', HttpStatus.NOT_FOUND);
        }

        return this.scheduleService.findByLocation(location)
          .then((list: Schedule[]) => this.scheduleTransformer.transformList(list));
      });
  }
}

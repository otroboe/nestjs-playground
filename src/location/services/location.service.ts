import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { constants } from '../../constants';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {

  constructor(
    @Inject(constants.TOKEN_REPO_LOCATION)
    private readonly locationRepository: Repository<Location>,
  ) {}

  public async find(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  public async findOne(id: string): Promise<Location> {
    return this.locationRepository.findOne(id, {
      relations: ['schedules'],
    });
  }

  public async create(rawData: object): Promise<Location> {
    const location = this.locationRepository.create(rawData);

    return this.locationRepository.save(location);
  }

  public async clear(): Promise<void> {
    return this.find()
      .then(async (locations) => {
        await Promise.all(locations.map(location => this.locationRepository.remove(location)));
      });
  }
}

import { Injectable } from '@nestjs/common';

import { FakerService } from '../faker/faker.service';
import { Location } from '../location/entities/location.entity';
import { locationData } from './data/locations.data';
import { LocationService } from '../location/services/location.service';
import { Movie } from '../location/entities/movie.entity';
import { movieData } from './data/movie.data';
import { MovieService } from '../location/services/movie.service';
import { Schedule } from '../location/entities/schedule.entity';
import { ScheduleService } from '../location/services/schedule.service';

@Injectable()
export class FixturesService {
  public locationRawData: object[];
  public movieRawData: object[];
  public scheduleTypeList: string[] = ['regular', '3d', 'imax'];

  private movieAssetsBasePath: string = '/assets/img/movies/';
  private movieImageExtension: string = '.jpg';

  constructor(
    private readonly fakerService: FakerService,
    private readonly locationService: LocationService,
    private readonly movieService: MovieService,
    private readonly scheduleService: ScheduleService,
  ) {
    this.locationRawData = locationData;
    this.movieRawData = movieData;
  }

  public async clear(): Promise<void> {
    await this.locationService.clear();
    await this.movieService.clear();
    await this.scheduleService.clear();
  }

  public injectLocations(): Promise<Location[]> {
    return Promise.all(this.locationRawData.map((location: object) =>
      this.locationService.create(location),
    ));
  }

  public injectMovies(): Promise<Movie[]> {
    return Promise.all(this.movieRawData.map((movie: any) =>
      this.movieService.create(Object.assign({}, movie, {
        poster: `${this.movieAssetsBasePath}${movie.imdb}${this.movieImageExtension}`,
        uuid: this.fakerService.generateUUID(),
      })),
    ));
  }

  public injectSchedules(locationList: Location[], movieList: Movie[]): Promise<Schedule[]> {
    const scheduleData: object[] = [];
    let dateList: Date[] = [];
    let chosenMovieList: Movie[] = [];

    locationList.forEach((location: Location) => {
      // For every location, generate times for the whole week
      dateList = this.fakerService.generatMovieTimeList();

      dateList.forEach((startAt: Date) => {
        // For every time, pick randomly max 3 movies playing at the same time
        chosenMovieList = this.fakerService.getRandomInArray(movieList, 3);

        // Save the data to create
        chosenMovieList.forEach((movie: Movie) => {
          scheduleData.push({
            startAt,
            movie,
            location,
            type: this.fakerService.getRandomInArray(this.scheduleTypeList, 1),
          });
        });
      });

    });

    return Promise.all(scheduleData.map((data: object) =>
      this.scheduleService.create(data),
    ));
  }
}

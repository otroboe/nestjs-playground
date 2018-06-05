import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { config } from '../../config';
import { Location } from './location.entity';
import { Movie } from './movie.entity';

@Entity({
  name: `schedule-${config.env}`,
})
export class Schedule {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('datetime')
  public startAt: Date;

  @Column('enum', { enum: ['regular', '3d', 'imax'] })
  public type: string;

  @ManyToOne(() => Location, location => location.schedules, { onDelete: 'CASCADE' })
  public location: Location;

  @ManyToOne(() => Movie, movie => movie.schedules, { onDelete: 'CASCADE' })
  public movie: Movie;
}

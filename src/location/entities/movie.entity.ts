import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { config } from '../../config';
import { Schedule } from './schedule.entity';

@Entity({
  name: `movie-${config.env}`,
})
export class Movie {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column({ comment: 'IMDB key' })
  public imdb: string;

  @Column({ comment: 'URL of the image' })
  public poster: string;

  @Column({ unique: true })
  public uuid: string;

  @OneToMany(() => Schedule, schedule => schedule.location)
  public schedules: Schedule[];
}

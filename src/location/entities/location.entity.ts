import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { config } from '../../config';
import { Schedule } from './schedule.entity';

@Entity({
  name: `location-${config.env}`,
})
export class Location {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public name: string;

  @Column()
  public address: string;

  @Column({ length: 30, nullable: true })
  public phone?: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  public latitude?: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  public longitude?: number;

  @OneToMany(() => Schedule, schedule => schedule.location)
  public schedules: Schedule[];
}

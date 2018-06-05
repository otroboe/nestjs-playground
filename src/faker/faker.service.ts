import * as moment from 'moment';
import * as faker from 'faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakerService {
  private idCounter: number = 0;

  public generateId(): number {
    this.idCounter++;

    return this.idCounter;
  }

  public generateUUID(): string {
    return faker.random.uuid();
  }

  public generateLocationName(): string {
    return faker.company.companyName(0);
  }

  public generateAddress(): string {
    return [
      faker.address.streetAddress(),
      faker.address.city(),
      faker.address.zipCode(),
      faker.address.state(),
      faker.address.country(),
    ].join(' ');
  }

  public generatePhone(): string {
    return faker.phone.phoneNumberFormat();
  }

  public generateLatitude(): number {
    return faker.address.latitude();
  }

  public generateLongitude(): number {
    return faker.address.longitude();
  }

  public generatMovieTimeList(): Date[] {
    // Hours from 11 to 23
    const hourList = Array(13).fill(11).map((val: number, index: number) => val + index);
    // Minutes from 0 to 55 (every 5)
    const minuteList = Array(12).fill(5).map((val: number, index: number) => val * index);
    // Days of a week from 0 to 6
    const dayList = Array(7).fill(0).map((val: number, index: number) => val + index);
    // Final list of datetime
    const output = [];

    let date: Date;
    let randomHourList: number[];

    dayList.forEach((dayNumber: number) => {
      date = moment().startOf('isoWeek').add(dayNumber, 'day').toDate();

      // For every day of the wee, pick max 5 hours
      randomHourList = this.getRandomInArray(hourList, 5);

      randomHourList.forEach((hour: number) => {
        // For every selected hour, set a random minute amount
        date.setHours(hour, faker.random.arrayElement(minuteList, 1), 0);

        // Push a copy of the date object in the output
        output.push(new Date(date.getTime()));
      });
    });

    return output;
  }

  public getRandomInArray(list: any[], max: number = null): any[] {
    const amount = faker.random.number({
      min: 1,
      max: max || list.length,
    });

    return list.sort(() => .5 - Math.random()).slice(0, amount);
  }
}

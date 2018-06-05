import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';

import { Location } from '../entities/location.entity';
import { LocationResponse } from '../swagger/location.response';

export const defaultLocationPropList: Array<string> = ['id', 'name'];
export const locationPropList: Array<string> = defaultLocationPropList.concat(['address', 'phone', 'latitude', 'longitude']);

@Injectable()
export class LocationTransformer {
  public transformList(list: Location[], props?: string): LocationResponse[] {
    const pickedProps = this.extractPickedProps(props);

    return list.map((location: Location) => _.pick(location, pickedProps));
  }

  public transformOne(location: Location): LocationResponse {
    return _.pick(location, ['name', 'address', 'phone', 'latitude', 'longitude']);
  }

  private extractPickedProps(props?: string): Array<string> {
    const inputPropList: Array<string> = props ? props.split(',') : [];

    return _.uniq(
      defaultLocationPropList.concat(
        inputPropList.filter((prop: string) => locationPropList.indexOf(prop) !== -1),
    ));
  }
}

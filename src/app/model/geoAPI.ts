import { GeoInfo } from 'src/app/model/geoInfo';
import { GeoStatus } from './geoStatus';

export class GeoAPI {
  postalCodes?: GeoInfo[];
  status?: GeoStatus;
}
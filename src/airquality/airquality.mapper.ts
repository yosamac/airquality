import { MeasurementDto } from './dto/measurement.dto';
import { omit } from 'lodash/fp';

const omitFields = omit([
  'cartodb_id',
  'the_geom',
  'the_geom_webmercator',
  'created_at',
  'updated_at'
]);


export function toMeasurementDto(
  data: any,
  variables: string[]
): MeasurementDto {
    const dataClean = omitFields(data);

  const stats = variables.reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        avg: dataClean[`${key.trim()}_avg`],
        min: dataClean[`${key.trim()}_min`],
        max: dataClean[`${key.trim()}_max`],
      }
    };
  }, {});

  return {
     // eslint-disable-next-line @typescript-eslint/camelcase
    station_id : dataClean.station_id,
    ...stats
  };
}



export function toMeasurementListDto(
  data: any[],
  variables: string[]
): MeasurementDto[] {
  return data.map(val => toMeasurementDto(val, variables));
}

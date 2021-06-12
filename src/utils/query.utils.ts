import { Query } from '../common/types';

export const buildSelect: (
  variables: string[],
  statsMeasurements: string []
) => string = (variables, statsMeasurements) => {

  const result = variables?.map(item => {
      return statsMeasurements?.map(measure =>
          ` ${measure.trim()}(measurements.${item.trim()}) ${item.trim()}_${measure.trim()}`
      );
  }) || [];
  return result.filter(Boolean).join();
};

export const buildWhere: (stations: string[], from: Date, to: Date) => string =
  (stations, from, to) => {

  const filter = stations?.map((item, i) => (i == stations.length - 1
      ? `station_id = '${item.trim()}'`
      : `station_id = '${item.trim()}' OR`
  )).join(' ');

  const where = from
      ? `${filter} AND timeinstant BETWEEN 
          '${new Date(from).toISOString().slice(0, 10)}' AND 
          '${new Date(to).toISOString().slice(0, 10)}'`
      : filter;

  return where;
};

export const buildQuery = (q: Query) => {
  const query = `
  SELECT station_id, stations.the_geom, population
      ${q.select ? ', ' + q.select : '' }
  FROM  aasuero.test_airquality_stations stations
      JOIN aasuero.test_airquality_measurements measurements USING(station_id)
      JOIN aasuero.esp_grid_1km_demographics grid ON ST_Intersects(grid.the_geom, stations.the_geom) 
      
  ${ q.where ? 'WHERE ' + q.where : '' }
  GROUP BY 
      station_id,  
      stations.the_geom,
      grid.population
`;
  return query;
}
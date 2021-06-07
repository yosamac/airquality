import { Injectable } from '@nestjs/common';

import { QueryParamDto } from './dto/request/queryParam.dto';
import { CartoService } from '../apis/carto';
import { handleError } from '../common/helper';
import { Query } from '../common/types';
import { ServiceLogger } from '../logger';
import { toMeasurementListDto } from './airquality.mapper';

const buildSelect: (
    variables: string[],
    statsMeasurements: string []
) => string = (variables, statsMeasurements) => {

    const result = variables.map(item => {
        return statsMeasurements.map(measure =>
            ` ${measure.trim()}(measurements.${item.trim()}) ${item.trim()}_${measure.trim()}`
        );
    });
    return result.join();
};

const buildWhere: (stations: string[]) => string = (stations) => {

    return stations.map((item, i) => (i == stations.length - 1
        ? `station_id = '${item.trim()}'`
        : `station_id = '${item.trim()}' OR`
    )).join(' ');
};


@Injectable()
export class AirQualityService {
    constructor(
        private readonly logger: ServiceLogger,
        private cartoService: CartoService
    ) {
        const instance = this.constructor;
        logger.setContext(instance.name);
    }

    getStatsMeasure(queryParam: QueryParamDto): Promise<any[]> {
        this.logger.info('Getting stats measurements for stations');

        const variables = queryParam?.variables?.split(',');
        const measurements = queryParam?.statsMeasure?.split(',');
        const stations = queryParam?.stations?.split(',');

        const query: Query = {
            select: buildSelect(variables, measurements),
            where: stations ? buildWhere(stations) : undefined
        };

        return this.cartoService.getStatsForStations(query)
            .then(res => toMeasurementListDto(res, variables))
            .catch(err => handleError(this.logger, err));
    }
}

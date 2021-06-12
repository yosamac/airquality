import { Injectable } from '@nestjs/common';

import { QueryParamDto } from './dto/request/queryParam.dto';
import { CartoService } from '../apis/carto';
import { handleError } from '../common/helper';
import { Query } from '../common/types';
import { ServiceLogger } from '../logger';
import { toMeasurementListDto } from './airquality.mapper';
import { MeasurementDto } from './dto/measurement.dto';
import { buildSelect, buildWhere } from '../utils/query.utils';

@Injectable()
export class AirQualityService {
    constructor(
        private readonly logger: ServiceLogger,
        private cartoService: CartoService
    ) {
        const instance = this.constructor;
        logger.setContext(instance.name);
    }

    getStatsMeasure(queryParam: QueryParamDto): Promise<MeasurementDto[]> {
        this.logger.info('Getting stats measurements for stations');

        const variables = queryParam?.variables?.split(',');
        const measurements = queryParam?.statsMeasure?.split(',');
        const stations = queryParam?.stations?.split(',');

        const query: Query = {
            select: buildSelect(variables, measurements),
            where: stations
                ? buildWhere(stations, queryParam.from, queryParam.to)
                : undefined,
        };

        return this.cartoService.getStatsForStations(query)
            .then(res => toMeasurementListDto(res, variables))
            .catch(err => handleError(this.logger, err));
    }
}

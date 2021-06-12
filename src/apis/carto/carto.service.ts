import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CARTO_API_ENDPOINT } from './carto.constant';
import { Query } from '../../common/types';
import { ServiceLogger } from '../../logger/logger.service';
import { buildQuery } from '../../utils/query.utils';

@Injectable()
export class CartoService {
    private cartoAPIUrl: string = CARTO_API_ENDPOINT;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: ServiceLogger
    ) {}

    getStatsForStations(q: Query): Promise<any> {
        const query = buildQuery(q);
        this.logger.info(query);
        this.logger.info(`${this.cartoAPIUrl}/sql?q=${query}`);
        return this.httpService.get(`${this.cartoAPIUrl}/sql?q=${query}`)
            .toPromise().then(res => {
                return res.data.rows;
            });

    }
}

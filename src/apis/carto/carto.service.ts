import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CARTO_API_ENDPOINT } from './carto.constant';
import { Query } from '../../common/types';
import { ServiceLogger } from '../../logger/logger.service';

@Injectable()
export class CartoService {
    private cartoAPIUrl: string = CARTO_API_ENDPOINT;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService,
        private readonly logger: ServiceLogger
    ) {}

    getAllStations(data: any): Promise<any>{
        const query = `
            SELECT *  
            FROM  aasuero.test_airquality_measurements 
        `;
        return this.httpService.get(`${this.cartoAPIUrl}/sql?q=${query}`)
            .toPromise().then(res => res.data.rows);
    }

    getStatsForStations(q: Query): Promise<any> {
        const query = `
            SELECT station_id, stations.the_geom, population ${q.select ? `, ${q.select}` : '' }
            FROM  aasuero.test_airquality_stations stations
                JOIN aasuero.test_airquality_measurements measurements USING(station_id)
                JOIN aasuero.esp_grid_1km_demographics grid ON ST_Intersects(grid.the_geom, stations.the_geom) 
                
            ${ q.where ? `WHERE  ${q.where}` : '' }
            GROUP BY 
                station_id,  
                stations.the_geom,
                grid.population
        `;
        this.logger.info(query);
        return this.httpService.get(`${this.cartoAPIUrl}/sql?q=${query}`)
            .toPromise().then(res => {
                return res.data.rows;
            });

    }

}

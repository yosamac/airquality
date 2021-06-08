import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CARTO_API_ENDPOINT } from './carto.constant';
import { Query } from '../../common/types';

@Injectable()
export class CartoService {
    private cartoAPIUrl: string = CARTO_API_ENDPOINT;

    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService
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
            SELECT station_id ${q.select ? `, ${q.select}` : '' }
            FROM  aasuero.test_airquality_measurements as measurements
            INNER JOIN aasuero.test_airquality_stations as stations USING(station_id)
            ${ q.where ? `WHERE  ${q.where}` : '' } 
            GROUP BY station_id
        `;
        console.log(query);
        return this.httpService.get(`${this.cartoAPIUrl}/sql?q=${query}`)
            .toPromise().then(res => res.data.rows);

    }

}

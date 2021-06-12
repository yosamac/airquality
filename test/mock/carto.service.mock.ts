import { cartoResponseFake } from './constants.fake';

export class CartoServiceMock {

    getStatsForStations(q: any): Promise<any> {
        return q.select.includes('invalid_field')
            ? Promise.reject({
                response:{
                    data: {
                        error:['Error invalid column']
                    },
                    status: 400
                }
            })
            : Promise.resolve(cartoResponseFake);
    }
}




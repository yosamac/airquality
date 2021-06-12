import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MainModule } from '../../src/main.module';
import { AirQualityService } from '../../src/airquality/airquality.service';
import { CartoService } from '../../src/apis/carto/carto.service';
import * as Mappers from '../../src/airquality/airquality.mapper';
import * as Helpers from '../../src/common/helper';
import { ServiceException } from '../../src/common/service.exception';
import { QueryParamDto } from '../../src/airquality/dto/request/queryParam.dto';
import { CartoServiceMock } from '../mock/carto.service.mock';

export const envs = {
    LOGGING_LEVEL: 'NONE',
    NODE_ENV: 'development'
};

const FIRST_ELEMENT = 0;

describe('AirqualityService', () => {
    let airQualityService: AirQualityService;

    beforeAll(async () => {

        process.env = Object.assign(process.env, envs);

        const app: TestingModule = await Test.createTestingModule({
            imports: [MainModule]
        })
        .overrideProvider(CartoService).useClass(CartoServiceMock)
        .compile();

        airQualityService = app.get<AirQualityService>(AirQualityService);
    });

    describe('#getStatsMeasure', () => {


        it('Should return the requested statistical measurement for each station', () => {

            const queryParam: QueryParamDto = {
                variables: 'no2,co, o3, pm10, pm2_5',
                statsMeasure: 'min,max, avg',
                from: new Date('10-01-2017'),
                to: new Date('10-01-2021'),
                stations: 'station_1, station_2',
            };

            const toMeasurementListDtoSpy = jest.spyOn(Mappers, 'toMeasurementListDto');
            return airQualityService.getStatsMeasure(queryParam)
                .then(res => {
                    expect(toMeasurementListDtoSpy).toBeCalledTimes(1);
                    expect(res).toBeInstanceOf(Array);
                    expect(res[FIRST_ELEMENT].geom).toBeDefined();
                    expect(res[FIRST_ELEMENT].population).toBeDefined();

                    const objKeys = Object.keys(res[FIRST_ELEMENT]);
                    const validateProjection = () => queryParam.variables.split(',')
                        .every(field => objKeys.includes(field));

                    expect(validateProjection()).toBeTruthy();
                    toMeasurementListDtoSpy.mockRestore();
                });
        });

        it('Should throw a service exception 400', () => {

            const queryParam: QueryParamDto = {
                variables: 'invalid_field',
                statsMeasure: 'invalid_stat',
                from: new Date('10-01-2017'),
                to: new Date('10-01-2021'),
                stations: 'station_1, station_2',
            };

            const handleErrorSpy = jest.spyOn(Helpers, 'handleError');

            return airQualityService.getStatsMeasure(queryParam)
                .catch(err => {
                    expect(err).toBeInstanceOf(ServiceException);
                    expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
                    expect(handleErrorSpy).toBeCalledTimes(1);
                    handleErrorSpy.mockRestore();
                });
        });
    });
});

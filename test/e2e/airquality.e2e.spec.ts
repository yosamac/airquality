import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';

import { MainModule } from '../../src/main.module';

describe('AirQualityController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        process.env = Object.assign(process.env, {
            LOGGING_LEVEL: 'NONE',
        });

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ MainModule ],
        })
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe ('/airquality/stats', () => {

        const queryParam = {
            variables: 'no2,co, o3, pm10, pm2_5',
            statsMeasure: 'min,max, avg',
            from: new Date('10-01-2017'),
            to: new Date('10-01-2021'),
            stations: 'station_1, station_2',
        };

        it('/ (GET) 200', () => {
            return request(app.getHttpServer())
                .get('/airquality/stats').query(queryParam)
                .expect(HttpStatus.OK);
        });

        it('Carto API / (GET) 400 ', () => {
            queryParam.variables = 'invalid_field';
            return request(app.getHttpServer())
                .get('/airquality/stats').query(queryParam)
                .expect(HttpStatus.BAD_REQUEST);
        });

        it('/ (GET) 400', () => {
            delete queryParam.from;
            return request(app.getHttpServer())
                .get('/airquality/stats').query(queryParam)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });
});

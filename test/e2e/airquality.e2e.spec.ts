import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import nock from 'nock';

import { MainModule } from '../../src/main.module';
import {
    CARTO_API_ENDPOINT
} from '../../src/apis/carto/carto.constant';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        process.env = Object.assign(process.env, {
            LOGGING_LEVEL: 'NONE',
        });

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [ MainModule ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeEach(() => {});

    describe ('/', () => {

    });
});

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from './logger/logger.module';
import configuration from './config/configuration';
import { AirQualityModule } from './airquality/airquality.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load:[configuration]
        }),
        LoggerModule.forRoot({ isGlobal: true }),
        AirQualityModule
    ]
})
export class MainModule {}

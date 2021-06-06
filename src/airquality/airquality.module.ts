import { Module } from '@nestjs/common';

import { CartoModule } from '../apis/carto';
import { AirQualityController } from './airquality.controller';
import { AirQualityService } from './airquality.service';

@Module({
    imports:[CartoModule],
    controllers: [AirQualityController],
    providers: [AirQualityService]
})
export class AirQualityModule {}

import {
    Controller, UseFilters,
    Get, Query, HttpStatus,
    HttpCode
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { AirQualityService } from './airquality.service';
import { QueryParamDto , QueryParamPipe } from './dto/request/queryParam.dto';
import { MeasurementDto } from './dto/measurement.dto';
import {
    ServiceHttpResponse,
    HttpExceptionFilter,
} from '../common/exception.filter';


@Controller('/airquality')
@ApiTags('Airquality')
@ApiBearerAuth()
@UseFilters(HttpExceptionFilter)
export class AirQualityController {
    constructor(private readonly airQualityService: AirQualityService) {}

    @Get('stats')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The statistical measurement were successfully returned',
        type: MeasurementDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Payload doesn\'t meet the schema',
        type: ServiceHttpResponse,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal error',
        type: ServiceHttpResponse
    })
    getStatsMeasure(
        @Query(QueryParamPipe) queryParam: QueryParamDto,
    ): Promise<any[]> {
        return this.airQualityService.getStatsMeasure(queryParam);
    }

    @Get('timeseries')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The time series were successfully returned',
        type: MeasurementDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Payload doesn\'t meet the schema',
        type: ServiceHttpResponse,
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal error',
        type: ServiceHttpResponse
    })
    getTimeseries(
        @Query(QueryParamPipe) queryParam: QueryParamDto,
    ): Promise<any[]> {
        return this.airQualityService.getStatsMeasure(queryParam);
    }
}

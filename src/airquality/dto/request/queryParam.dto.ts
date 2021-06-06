import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

import { JoiValidationPipe } from '../../../common/joi.validation.pipe';

export class QueryParamDto {
    @ApiProperty({ required: false, format: 'so2, no2, co...' })
    variables: string;
    @ApiProperty({ required: false })
    statsMeasure: string;
    @ApiProperty({ required: false, enum:['week', 'day', 'hour'] })
    step: string;
    @ApiProperty({ required: false })
    from: Date;
    @ApiProperty({ required: false })
    to: Date;
    @ApiProperty({ required: false })
    stations: string;
    @ApiProperty({ required: false })
    type: string;
    @ApiProperty({ required: false, isArray: true })
    coordinates: number;
}

export const QueryParamSchema = Joi.object({
    variables: Joi.string().label('variable').description('Variables'),
    statsMeasure: Joi.string().lowercase()
        .label('statsMeasure').description('Statistical Measurements'),
    step: Joi.string().valid('week', 'day', 'hour')
        .label('step'),
    from: Joi.date().label('from').description('Time range start'),
    to: Joi.when('from', {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref('from')).required()
    }).label('to').description('Time range end'),
    stations: Joi.string().label('stations').description('Stations listed'),
    type: Joi.string().label('type').description('Geometry type'),
    coordinates: Joi.array().items(Joi.number()).when('type', {
        is: Joi.exist(),
        then: Joi.required()
    }).label('coordinates').description('Coordinates listed')
});

export const QueryParamPipe = new JoiValidationPipe(QueryParamSchema);
import { ApiProperty } from '@nestjs/swagger';

export class Stats {
    @ApiProperty({ required: false })
    avg: number;
    @ApiProperty({ required: false })
    max: number;
    @ApiProperty({ required: false })
    min: number;
}

export class MeasurementDto {
    @ApiProperty({ required: false })
    station_id: string;
    @ApiProperty({ required: false })
    timeInstant?: string;
    @ApiProperty({ required: false })
    so2?: Stats;
    @ApiProperty({ required: false })
    no2?: Stats;
    @ApiProperty({ required: false })
    pm10?: Stats;
    @ApiProperty({ required: false })
    pm2_5?: Stats;
    @ApiProperty({ required: false })
    co?: Stats;
    @ApiProperty({ required: false })
    o3?: Stats;
}

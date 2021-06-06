import { HttpModule, Module } from '@nestjs/common';

import { CartoService } from './carto.service';

@Module({
    imports: [HttpModule],
    providers: [CartoService],
    exports: [CartoService]
})
export class CartoModule {}

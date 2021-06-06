import { HttpStatus, ExceptionFilter, Catch,
    ArgumentsHost, HttpException
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ServiceException } from './service.exception';

export class ServiceHttpResponse {
    @ApiProperty()
    readonly code: HttpStatus;
    @ApiProperty()
    readonly path: string;
    @ApiProperty()
    readonly message: string;
    @ApiProperty()
    readonly timestamp: string;
}

@Catch(ServiceException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const body: ServiceHttpResponse = {
            code: status ,
            path: request.url,
            message: exception.message,
            timestamp: new Date().toISOString()
        };

        response.status(status).json(body);
    }
}
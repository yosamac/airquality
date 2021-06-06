import { HttpStatus, HttpException } from '@nestjs/common';

export class ServiceException extends HttpException {
    constructor(status: HttpStatus, private msg: string) {
        super(msg, status);
    }

    getMessage(): string {
        return this.msg;
    }
}
import { HttpStatus } from '@nestjs/common';

import { ServiceException } from './service.exception';
import { ServiceLogger } from '../logger';

type ExplicitError = {
    status: HttpStatus;
    msg?: string;
    response?: any
};

function handlerHelper(error): void | never {

    if (error instanceof ServiceException) throw error;
    if ('statusCode' in error) {
        throw new ServiceException(
            error.statusCode,
            error.msg || HttpStatus[error.statusCode]
        );
    }

    throw error;
}

export const handleError: (
    logger: ServiceLogger,
    err?: ExplicitError
) => ((err: any) => any) | any =
    (logger, err) => {

        if (err) {
            logger?.debug(
                'Debugging managed error:',
                JSON.stringify(err, null, 4)
            );

            handlerHelper(err?.response?.data || err);
        }
    };
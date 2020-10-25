import { IServiceError } from '../error';

export class BadRequestError extends Error implements IServiceError {
    statusCode = 400;
    constructor() {
        super(`Bad request`);
    }
}

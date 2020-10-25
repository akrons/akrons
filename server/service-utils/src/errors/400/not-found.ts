import { IServiceError } from '../error';

export class NotFoundError extends Error implements IServiceError {
    statusCode = 404;
    constructor() {
        super(`Element was not found!`);
    }
}

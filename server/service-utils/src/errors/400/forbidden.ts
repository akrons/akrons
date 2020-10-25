import { IServiceError } from '../error';

export class ForbiddenError extends Error implements IServiceError {
    statusCode = 403;
    constructor() {
        super(`Forbidden`);
    }
}

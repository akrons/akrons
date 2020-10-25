import { IServiceError } from '../error';

export class NotAuthorizedError extends Error implements IServiceError {
    statusCode = 401;
    constructor(reason?: string) {
        super(`User is not authorized!` + (reason ? `(${reason})` : ''));
    }
}

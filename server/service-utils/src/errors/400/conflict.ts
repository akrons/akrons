import { IServiceError } from '../error';

export class ConflictError extends Error implements IServiceError {
    statusCode = 409;
    constructor(reason: string) {
        super(reason);
    }
}

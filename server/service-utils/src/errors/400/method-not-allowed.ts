import { IServiceError } from '../error';

export class MethodNotAllowedError extends Error implements IServiceError {
    statusCode = 405;
    constructor() {
        super(`The method is not allowed`);
    }
}

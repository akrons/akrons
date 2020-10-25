import { IServiceError } from '../error';

export class GoneError extends Error implements IServiceError {
    statusCode = 410;
    constructor(name: string) {
        super(`The resource is gone (${name})`);
    }
}

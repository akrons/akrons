import { IServiceError } from '../error';

export class ResourceLockedError extends Error implements IServiceError {
    statusCode = 423;
    constructor(name: string) {
        super(`Resource locked (${name})`);
    }
}

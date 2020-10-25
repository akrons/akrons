import { IServiceError } from '../error';

export class NotImplementedError extends Error implements IServiceError {
    statusCode = 501;
    constructor(name?: string) {
        super(name ? `${name} is not Implemented` : `Not Implemented`);
    }
}

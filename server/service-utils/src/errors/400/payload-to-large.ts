import { IServiceError } from '../error';

export class PayloadToLarge extends Error implements IServiceError {
    statusCode = 413;
    constructor(size: number, limit?: number) {
        super(
            limit ? `The ressource exceed the total storage limit of ${limit} bytes, with ${size} bytes.`
                : `The ressource exceed the upload limit with ${size} bytes.`
        );
    }
}

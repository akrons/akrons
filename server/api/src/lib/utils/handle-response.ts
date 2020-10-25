import { NextFunction, Response } from 'express';

export function HandleResponse(result: Promise<any>, res: Response, next: NextFunction): void {
    result
        .then(x => res.send(x))
        .catch(next); // the error is passed to the error-handler
}

export function HandleVoidResponse(result: Promise<void>, res: Response, next: NextFunction): void {
    result
        .then(() => res.sendStatus(204)) // 204 means that there is no response body, so the angular client will not throw any error
        .catch(next); // the error is passed to the error-handler
}

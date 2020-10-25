import { Router, Request, Response, NextFunction } from 'express';
import { NotImplementedError } from '@akrons/service-utils';

export const router = Router();

router.get('/loginstate/registertoken', (req: Request, res: Response, next: NextFunction) => {
    return next(new NotImplementedError());
});

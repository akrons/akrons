import { Router, Request, Response, NextFunction } from 'express';
import { createUserSession } from '../../../lib/auth/session';
import { BadRequestError, NotAuthorizedError } from '@akrons/service-utils';
import { RefreshToken } from '../../../lib/auth/user-token';

export const router = Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    let code = req.body.code;
    if (!code) {
        next(new BadRequestError());
    }
    createUserSession(code)
        .then(x => res.send(x))
        .catch(next);
});

router.get('/refresh', (req: Request, res: Response, next: NextFunction) => {
    if (!req.userToken) return next(new BadRequestError());
    if (!req.oauthToken) return next(new NotAuthorizedError());
    RefreshToken(req.userToken, req.oauthToken)
        .then(x => res.send(x))
        .catch(next);
});

router.post('/verify', (req: Request, res: Response, next: NextFunction) => {
    if (!req.userToken) return next(new BadRequestError());
    if (!req.oauthToken) return next(new Error('request has userToken but no oauthToken'));
    res.send(req.userToken);
});

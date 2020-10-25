import { Router, Request, Response, NextFunction } from 'express';

export function DeprecatedRoute(route: Router, message?: string): Router {
    const router = Router();
    router.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Warning', `299 - "Deprecated API${message ? ': ' + message : ''}"`);
        next();
    });
    router.use(route);
    return router;
}

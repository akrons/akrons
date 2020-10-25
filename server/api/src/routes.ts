import { NextFunction, Request, Response, Router } from 'express';
import { Menu } from './lib/collections/menu';
import { getEnvironment } from './lib/env';
import { router as apiRoute } from './api/route';

export const router = Router();

router.use('/api', apiRoute);

router.get('/robots.txt', (req: Request, res: Response, next: NextFunction) => {

    const disallows = [];

    if (getEnvironment().FORBID_ROBOTS) {
        disallows.push('/');
    } else {
        disallows.push('/login/', '/admin/', '/loginredirect');
    }
    return res
        .type('text/plain')
        .send(`User-agent: *\n` + disallows.map(x => `Disallow: ${x}`).join('\n'));
});

router.get('/sitemap.xml', (req: Request, res: Response, next: NextFunction) => {
    return Menu.getInstance().loadMenuAsSiteMapXml('main', req.permissions, req.headers.host)
        .then(x => res.type('application/xml').send(x))
        .catch(next);
});

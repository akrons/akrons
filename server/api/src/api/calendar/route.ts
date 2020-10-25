import { Router, Request, Response, NextFunction } from 'express';
import { Calendar } from '../../lib/collections/calendar';
import { Permissions } from '../../lib/collections/permissions';

export const router = Router();

router.use(Permissions.requireMiddleware('api.common.calendar'));

router.get('', Permissions.requireMiddleware('api.common.calendar.read'), (req: Request, res: Response, next: NextFunction) => {
    Calendar.getInstance().loadEventsForMonthWithSpan(3, 1)
        .then(x => res.send(x))
        .catch(next);
});

router.get('/csv', Permissions.requireMiddleware('api.common.calendar.csv'), (req: Request, res: Response, next: NextFunction) => {
    return res.redirect(301, `https://adventgemeinde-magdeburg.azurewebsites.net/api/calendar/csv`);
});

router.get('/ical', Permissions.requireMiddleware('api.common.calendar.ical'), (req: Request, res: Response, next: NextFunction) => {
    const calendar = Calendar.getInstance();
    calendar.loadEventsForMonthWithSpan(3, 1)
        .then(x => res.type('text/calendar').send(calendar.getICal(x)))
        .catch(next);
});

router.get('/:year/:month', Permissions.requireMiddleware('api.common.calendar.read'), (req: Request, res: Response, next: NextFunction) => {
    Calendar.getInstance().loadEventsForMonth(req.params.month, req.params.year)
        .then(x => res.send(x))
        .catch(next);
});

import { Router, Request, Response } from 'express';
import { router as authRoute } from './auth/route';
import { router as backendRoute } from './backend/route';
import { router as calendarRoute } from './calendar/route';
import { router as navigationRoute } from './navigation/route';
import { router as pageRoute } from './page/route';
import { router as sermonsRoute } from './sermons/route';
import { router as userRoute } from './user/route';
import { router as fileRoute } from './file/route';
import { Permissions } from '../lib/collections/permissions';

export const router = Router();

router.use(Permissions.requireMiddleware('api'));
router.use('/auth', authRoute);
router.use('/backend', backendRoute);
router.use('/calendar', calendarRoute);
router.use('/navigation', navigationRoute);
router.use('/page', pageRoute);
router.use('/sermon', sermonsRoute);
router.use('/user', userRoute);
router.use('/file', fileRoute);

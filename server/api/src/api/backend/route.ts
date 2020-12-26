import { Router, Request, Response } from 'express';
import { router as pageRoute } from './page/route';
import { router as jsonImportRoute } from './json-import/route';
import { router as fileRoute } from './file/route';
import { router as youtubeRoute } from './youtube/route';
import { router as indicesRoute } from './indices/route';
import { router as viewsRoute } from './views/route';
import { requirePermissionMiddleware } from '@akrons/auth-lib';

export const router = Router();

router.use(requirePermissionMiddleware('api.backend'));
router.use('/page', pageRoute);
router.use('/json-import', jsonImportRoute);
router.use('/file', fileRoute);
router.use('/youtube', youtubeRoute);
router.use('/indices', indicesRoute);
router.use('/views', viewsRoute);

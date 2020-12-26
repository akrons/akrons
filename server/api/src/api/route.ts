import { Router, Request, Response } from 'express';
import { router as backendRoute } from './backend/route';
import { router as pageRoute } from './page/route';
import { router as fileRoute } from './file/route';
import { requirePermissionMiddleware } from '@akrons/auth-lib';

export const router = Router();

router.use(requirePermissionMiddleware('api'));
router.use('/backend', backendRoute);
router.use('/page', pageRoute);
router.use('/file', fileRoute);

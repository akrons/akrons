import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Permissions } from '../../../lib/collections/permissions';
import { HandleResponse, HandleVoidResponse } from '../../../lib/utils/handle-response';
import { Preacher } from '../../../lib/collections/preacher';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.preacher'));

router.get('', Permissions.requireMiddleware('api.backend.preacher.read-all'), (req, res, next) => {
    HandleResponse(Preacher.getInstance().getAll(), res, next);
});

router.post('', Permissions.requireMiddleware('api.backend.preacher.update'), (req, res, next) => {
    HandleResponse(Preacher.getInstance().create(undefined, req.body), res, next);
});


router.put('/search', Permissions.requireMiddleware('api.backend.preacher.read'), (req, res, next) => {
    if (!req.body) return next(new BadRequestError());
    HandleResponse(Preacher.getInstance().search(req.body.query), res, next);
});

router.get('/:id', Permissions.requireMiddleware('api.backend.preacher.read'), (req, res, next) => {
    HandleResponse(Preacher.getInstance().get(req.params.id), res, next);
});

router.delete('/:id', Permissions.requireMiddleware('api.backend.preacher.delete'), (req, res, next) => {
    HandleVoidResponse(Preacher.getInstance().delete(req.params.id), res, next);
});

router.post('/:id', Permissions.requireMiddleware('api.backend.preacher.update'), (req, res, next) => {
    HandleVoidResponse(Preacher.getInstance().update(req.params.id, req.body), res, next);
});

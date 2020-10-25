import { Router } from 'express';
import { Permissions } from '../../../lib/collections/permissions';
import { JsonImport } from '../../../lib/json-import';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.json-import'));

router.post('/:collection/one', (req, res, next) => {
    JsonImport.getInstance().importOne(req.params.collection, req.body)
        .then(x => res.send(x))
        .catch(next);
});

router.post('/:collection/many', (req, res, next) => {
    JsonImport.getInstance().importMany(req.params.collection, req.body)
        .then(x => res.send(x))
        .catch(next);
});

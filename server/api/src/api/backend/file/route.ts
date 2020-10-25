import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import multer from 'multer';
import { Permissions } from '../../../lib/collections/permissions';
import { File } from '../../../lib/collections/file';
import { getEnvironment } from '../../../lib/env';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.file'));

router.get('', Permissions.requireMiddleware('api.backend.file.read.all'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().readAll()
        .then(result => {
            res.send(result);
        })
        .catch(next);
});

const upload = multer({
    dest: File.getInstance().fileStorageDirectory,
    fileFilter: File.getInstance().multerFileFilter,
});

router.get('/usage', Permissions.requireMiddleware('api.backend.file.usage'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().getStorageUsage()
        .then(result => res.send({ result: result, limit: getEnvironment().STORAGE_BYTE_LIMIT }))
        .catch(next);
});

router.post('', Permissions.requireMiddleware('api.backend.file.upload'), upload.any(), (req: Request, res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] = <any>req.files;
    if (files.length !== 1) {
        next(new BadRequestError());
    }
    if (req.fileStorageReservationToken) {
        File.getInstance().releaseReservation(req.fileStorageReservationToken);
    }
    File.getInstance().create(files[0].filename, files[0].fieldname, files[0].mimetype)
        .then(() => res.send(files[0].fieldname))
        .catch(next);
});

router.get('/:id', Permissions.requireMiddleware('api.backend.file.read'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().readOne(req.params.id)
        .then(result => {
            res.send(result);
        })
        .catch(next);
});

router.post('/:id', Permissions.requireMiddleware('api.backend.file.edit'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().update(req.params.id, req.body)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
});

router.delete('/:id', Permissions.requireMiddleware('api.backend.file.delete'), (req: Request, res: Response, next: NextFunction) => {
    File.getInstance().delete(req.params.id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
});


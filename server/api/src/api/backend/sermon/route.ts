import { Router, Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@akrons/service-utils';
import { Sermon } from '../../../lib/collections/sermon';
import multer from 'multer';
import { Permissions } from '../../../lib/collections/permissions';
import { File } from '../../../lib/collections/file';

export const router = Router();
router.use(Permissions.requireMiddleware('api.backend.sermon'));

// gets all sermons
router.get('', Permissions.requireMiddleware('api.backend.sermon.read.all'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().loadAllSermons()
        .then(result => {
            res.send(result);
        })
        .catch(next);
});

// uploads an sermon

const upload = multer({
    dest: Sermon.getInstance().sermonStorageDirectory,
    fileFilter: File.getInstance().multerFileFilter,
});

router.post('', Permissions.requireMiddleware('api.backend.sermon.upload'), upload.any(), (req: Request, res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] = <any>req.files;
    if (files.length !== 1) {
        next(new BadRequestError());
    }
    if (req.fileStorageReservationToken) {
        File.getInstance().releaseReservation(req.fileStorageReservationToken);
    }
    Sermon.getInstance().create(files[0].filename, files[0].fieldname)
        .then(() => res.send(files[0].filename))
        .catch(next);
});

// gets all sermons with PK
// router.get('/:partitionKey', (req: Request, res: Response, next: NextFunction) => {
//     let partitionKey: string | undefined = req.params.partitionKey;
//     if (!partitionKey) {
//         return next(new BadRequestError());
//     }
//     Sermon.getInstance().loadAllSermons(partitionKey)
//         .then(result => {
//             res.send(result);
//         })
//         .catch(next);
// });

// gets sermon metadata
router.get('/:id', Permissions.requireMiddleware('api.backend.sermon.read'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().getMetadata(req.params.id)
        .then(result => {
            res.send(result);
        })
        .catch(next);
});

// updates sermon metadata
router.post('/:id', Permissions.requireMiddleware('api.backend.sermon.edit'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().update(req.params.id, req.body)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
});

// deletes a sermon
router.delete('/:id', Permissions.requireMiddleware('api.backend.sermon.delete'), (req: Request, res: Response, next: NextFunction) => {
    Sermon.getInstance().delete(req.params.id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch(next);
});


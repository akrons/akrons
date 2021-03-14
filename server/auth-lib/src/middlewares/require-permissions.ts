import { NotAuthorizedError } from '@akrons/service-utils';
import { RequestHandler } from 'express';
import { hasPermission } from '@akrons/common-auth';

export function requirePermissionMiddleware(permission: string): RequestHandler {
    return (req, res, next): void => {
        if (!hasPermission(permission, req.permissions)) {
            console.log('has Permissions:', req.permissions);
            next(new NotAuthorizedError('permission required: ' + permission));
        }
        next();
    };
}


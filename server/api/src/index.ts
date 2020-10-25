require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import { IServiceError } from '@akrons/service-utils';
import { GetTokensMiddleware } from './lib/auth/user-token';
import { loadKeys } from './lib/auth/keys';
import { Permissions } from './lib/collections/permissions';
import { getEnvironment, loadEnvironment } from './lib/env';

async function main() {
    await loadEnvironment();
    await loadKeys();
    const app = express();
    app.use(express.json({ limit: "100mb" }));

    if (getEnvironment().CORS_ALL === 'true') {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if (req.method === 'OPTIONS') {
                res.sendStatus(204);
            } else {
                next();
            }
        });
    }

    app.use(
        Permissions.setDefaultPermissionsMiddleware(),
        GetTokensMiddleware(),
    );

    app.use((await import('./routes')).router);

    app.use((err: IServiceError | any, req: Request, res: Response, next: NextFunction) => {
        if (err.statusCode) {
            const is400 = err.statusCode < 500 && err.statusCode >= 400;
            if (!is400 || getEnvironment().LOG_400_ERRORS === true) {
                console.error(err);
            }
            return res.sendStatus(err.statusCode);
        }
        console.error(err);
        res.sendStatus(500);
        next();
    });

    if (getEnvironment().DISABLE_AUTHORIZATION) {
        console.warn('Authorization is disabled!');
    }

    app.listen(parseInt(getEnvironment().PORT), getEnvironment().HOST, () =>
        console.log(`Server listening on host [${getEnvironment().HOST}] and port ${getEnvironment().PORT}!`),
    );
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

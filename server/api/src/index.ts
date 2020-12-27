require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import { IServiceError, loadD4sKey } from '@akrons/service-utils';
import { GetTokenMiddleware } from '@akrons/auth-lib';
import { getEnvironment, loadEnvironment } from './lib/env';

async function main() {
    await loadEnvironment();
    // await loadKeys();
    const app = express();
    app.use(express.json({ limit: "100mb" }));

    if (getEnvironment().CORS_ALL === 'true') {
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            if (req.method === 'OPTIONS') {
                res.sendStatus(204);
            } else {
                next();
            }
        });
    }

    const authPublicKey = await loadD4sKey(
        getEnvironment().PUBLIC_KEY_FILE_PATH,
        getEnvironment().D4S,
        false,
        getEnvironment().AUTH_SERVICE_NAME,
        getEnvironment().SERVICE_NAME,
    )

    app.use(
        GetTokenMiddleware(authPublicKey),
        (req, res, next) => {
            req.permissions = req.permissions ? [...req.permissions, ...getEnvironment().DEFAULT_PERMISSIONS] : getEnvironment().DEFAULT_PERMISSIONS;
            next();
        }
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

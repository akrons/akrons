import express, { Request, Response, NextFunction } from 'express';
import { IServiceError } from '@akrons/service-utils';
import { Environment } from './lib/env';
import { Keys } from './lib/keys';
import { GetTokenMiddleware } from '@akrons/auth-lib';
import { ensureInitialAuth } from './lib/initial-auth';

async function main() {
    await Environment.loadEnvironment();
    await Keys.loadKeys();
    await ensureInitialAuth();
    const app = express();
    app.use(express.json({ limit: "100mb" }));

    if (Environment.get().corsAll) {
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

    app.use(
        GetTokenMiddleware(Keys.get().publicKey),
    )
    //     Permissions.setDefaultPermissionsMiddleware(),
    //     GetTokensMiddleware(),
    // );

    app.use((await import('./routes')).router);

    app.use((err: IServiceError | any, req: Request, res: Response, next: NextFunction) => {
        if (err.statusCode) {
            const is400 = err.statusCode < 500 && err.statusCode >= 400;
            if (!is400 || Environment.get().log400Errors === true) {
                console.error(err);
            }
            return res.sendStatus(err.statusCode);
        }
        console.error(err);
        res.sendStatus(500);
        next();
    });

    app.listen(Environment.get().port, Environment.get().hostname, () =>
        console.log(`Server listening on host [${Environment.get().hostname}] and port ${Environment.get().port}!`),
    );
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

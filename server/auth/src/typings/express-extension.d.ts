declare namespace Express {
    export interface Request {
        sessionToken?: import('@akrons/types').auth.SessionToken;
        expiredSessionToken?: import('@akrons/types').auth.SessionToken;
        permissions: string[];
    }
}

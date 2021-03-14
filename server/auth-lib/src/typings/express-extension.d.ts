declare namespace Express {
    export interface Request {
        sessionToken?: import('@akrons/common-auth').SessionToken;
        expiredSessionToken?: import('@akrons/common-auth').SessionToken;
        permissions: string[];
    }
}

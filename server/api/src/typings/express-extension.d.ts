declare namespace Express {
    export interface Request {
        sessionToken?: import('@akrons/auth-lib').SessionToken;
        permissions: string[];
        fileStorageReservationToken?: string;
    }
}

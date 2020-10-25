// import { ICertifiedUserToken } from './tokens';

declare namespace Express {
    export interface Request {
        userToken?: import('../lib/auth/user-token').ICertifiedUserToken;
        oauthToken?: import('simple-oauth2').AccessToken;
        permissions: string[];
        fileStorageReservationToken?: string;
    }
}

import { create, OAuthClient } from 'simple-oauth2';
import { getEnvironment } from '../env';

export function getOauthClient(): OAuthClient {
    return create({
        client: {
            id: getEnvironment().CLIENT_ID,
            secret: getEnvironment().CLIENT_SECRET,
        },
        auth: {
            tokenHost: getEnvironment().TOKEN_HOST,
            authorizePath: getEnvironment().AUTHORIZE_PATH,
            tokenPath: getEnvironment().TOKEN_PATH,
        },
    });
}

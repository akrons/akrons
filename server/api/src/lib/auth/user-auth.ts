import { getOauthClient } from './oauth-client';
import { AccessToken } from 'simple-oauth2';
import { getEnvironment } from '../env';

export async function getUserOAuthToken(code: string): Promise<AccessToken> {
    const oauthClient = getOauthClient();
    const result = await oauthClient.authorizationCode.getToken({
        code: code,
        redirect_uri: getEnvironment().CALLBACK_URL,
    });
    const token = oauthClient.accessToken.create(result);
    return token;
}

export async function refreshUserOAuthToken(accessToken: AccessToken): Promise<AccessToken> {
    return await accessToken.refresh();
}

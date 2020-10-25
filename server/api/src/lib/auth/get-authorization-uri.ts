import { getOauthClient } from './oauth-client';
import { getEnvironment } from '../env';

export function getAuthorizationUri(): string {
    return getOauthClient().authorizationCode.authorizeURL({
        redirect_uri: getEnvironment().CALLBACK_URL,
        scope: getEnvironment().USER_SCOPE.split(','),
    });
}


export function getOAuthLogoutUri(): string {
    return 'https://login.microsoftonline.com/' + getEnvironment().TENANT_ID + '/oauth2/logout';
}

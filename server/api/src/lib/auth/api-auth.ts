import { AccessToken, Token  } from 'simple-oauth2';
import { getOauthClient } from './oauth-client';

export async function getApiOauthToken(): Promise<AccessToken> {
    let oAuthClient = getOauthClient();
    let token: Token = await oAuthClient.clientCredentials.getToken({
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default', 
        // ['Calendars.Read', 'Directory.Read.All', 'Directory.ReadWrite.All', 'Group.Read.All', 'GroupMember.Read.All ', 'GroupMember.ReadWrite.All'],
        // resource: 'https://graph.microsoft.com',
    });
    return oAuthClient.accessToken.create(token);
}

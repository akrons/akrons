import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { AccessToken } from 'simple-oauth2';

export function getAuthenticatedGraphClient(accessToken: AccessToken): Client {
    // Initialize Graph client
    return Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken.token.access_token);
        },
        // baseUrl: 'https://logme.rudolph.pro'
    });
}

import { Group } from '@microsoft/microsoft-graph-types';
import { getAuthenticatedGraphClient } from './graph-client';
import { getApiOauthToken } from '../auth/api-auth';

export class GraphGroups {
    private static instance: GraphGroups | undefined;
    static getInstance(): GraphGroups {
        if (!GraphGroups.instance) {
            GraphGroups.instance = new GraphGroups();
        }
        return GraphGroups.instance;
    }
    private constructor() { }

    async readAllGroups(): Promise<Group[]> {
        const apiAccessToken = await getApiOauthToken();
        let graphClient = getAuthenticatedGraphClient(apiAccessToken);
        return await graphClient
            .api(`/groups`)
            .get()
            .then(x => {
                return x.value;
            });
    }
}

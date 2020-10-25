import { NotAuthorizedError } from '@akrons/service-utils';
import { Db, Collection } from 'mongodb';
import { Permissions } from './permissions';
import { Views } from './views';
import { DefaultCollection } from './default-collection';
import { cms } from '@akrons/types';

export class Pages extends DefaultCollection<cms.IPage>{
    private static instance: Pages | undefined;

    private constructor() {
        super();
    }
    public static getInstance(): Pages {
        if (!Pages.instance) {
            Pages.instance = new Pages();
        }
        return Pages.instance;
    }

    async createIndex(db: Db): Promise<void> {
        await this.getCollection(db).createIndex({ id: 1 });
    }
    async canMoveId(id: string, x: cms.IPage): Promise<boolean> {
        return true;
    }
    updateMap(x: cms.IPage): Partial<cms.IPage> {
        return {
            title: x.title,
            elements: x.elements,
            options: x.options
        };
    }

    insertMap(id: string, x: cms.IPage): cms.IPage {
        return {
            id,
            title: x.title,
            elements: x.elements,
            options: x.options
        };
    }

    async loadPage(id: string, permissions: string[]): Promise<cms.IPage> {
        let result = await this.get(id);
        // if (result.requiredViewPermissions && !Permissions.getInstance().hasPermission(result.requiredViewPermissions, permissions)) {
        //     throw new NotAuthorizedError(`Permission ${result.requiredViewPermissions} is required!`);
        // }
        // result.requiredViewPermissions = undefined;
        await Views.getInstance().count('page', result.id);
        return result;
    }

    getCollection(db: Db): Collection<cms.IPage> {
        return db.collection<cms.IPage>('page');
    }
}

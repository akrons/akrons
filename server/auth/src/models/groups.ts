import { Db, Collection } from 'mongodb';
import { DefaultCollection } from './default-collection';
import { IGroup, IInsertGroup } from '@akrons/common-auth';

export class Groups extends DefaultCollection<IInsertGroup, IGroup, IGroup> {
    allowRandomId = true;
    private static instance: Groups | undefined;
    private constructor() {
        super();
    }

    public static getInstance(): Groups {
        if (!Groups.instance) {
            Groups.instance = new Groups();
        }
        return Groups.instance;
    }

    async createIndex(db: Db): Promise<void> {
        await this.getCollection(db).createIndex({ id: 1 });
    }

    async canMoveId(id: string, x: IGroup): Promise<boolean> {
        return false;
    }

    updateMap({ name, permissions }: IGroup): Partial<IGroup> {
        return {
            name,
            permissions,
        }
    }

    insertMap(id: string, x: IInsertGroup): IGroup {
        return {
            id: id,
            name: x.name,
            permissions: x.permissions,
        }
    }

    getCollection(db: Db): Collection<IGroup> {
        return db.collection('groups');
    }

}

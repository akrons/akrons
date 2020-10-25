import { Db, Collection } from 'mongodb';
import { mongoConnection } from '../mongo';
import { DefaultCollection } from './default-collection';

export class Preacher extends DefaultCollection<IPreacher> {
    private static instance: Preacher | undefined;
    allowRandomId = true;

    private constructor() {
        super();
    }

    public static getInstance(): Preacher {
        if (!this.instance) {
            this.instance = new Preacher();
        }
        return this.instance;
    }

    updateMap(x: IPreacher): Partial<IPreacher> {
        return {
            name: x.name,
        };
    }

    insertMap(id: string, x: IPreacher): IPreacher {
        return {
            id: id,
            name: x.name,
        };
    }

    async canMoveId(): Promise<boolean> {
        return false;
    }

    async search(query?: string): Promise<IPreacher[]> {
        if (!query) return [];
        return mongoConnection(async (db) => {
            return await this.getCollection(db).find({ name: { $regex: query, $options: 'i' } }).toArray();
        });
    }

    async createIndex(db: Db): Promise<void> {
        await Promise.all([
            this.getCollection(db).createIndex({ name: 1 }),
            this.getCollection(db).createIndex({ id: 1 }),
        ]);
    }

    getCollection(db: Db): Collection<IPreacher> {
        return db.collection<IPreacher>('preacher');
    }
}

export interface IPreacher {
    id: string;
    name: string;
}

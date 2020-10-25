import { Collection, Db } from 'mongodb';
import { mongoConnection } from '../mongo';

export class Views {
    private static instance: Views | undefined;
    private constructor() { }
    public static getInstance(): Views {
        if (!this.instance) {
            this.instance = new Views();
        }
        return this.instance;
    }

    count(type: string, id: string): Promise<void> {
        return mongoConnection(async (db) => {
            let result = await this.getCollection(db).updateOne({ type, id }, { $inc: { views: 1 } });
            if (result.result.nModified === 0) {
                await this.getCollection(db).insertOne({
                    id,
                    type,
                    views: 1,
                });
            }
        });
    }

    getViews(): Promise<IViewsRecord[]> {
        return mongoConnection(async (db) => {
            return this.getCollection(db).find({}).toArray();
        });
    }

    getCollection(db: Db): Collection<IViewsRecord> {
        return db.collection('views');
    }
}

interface IViewsRecord {
    type: string;
    id: string;
    views: number;
}

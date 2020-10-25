import { MongoClient, Db } from 'mongodb';
import { TimeSpan } from './time-span';
import { getEnvironment } from './env';
import { Calendar } from './collections/calendar';
import { File } from './collections/file';
import { Menu } from './collections/menu';
import { Pages } from './collections/pages';
import { Permissions } from './collections/permissions';
import { Sermon } from './collections/sermon';
import { Preacher } from './collections/preacher';

let globalMongoClient: MongoClient | undefined;
let mongoClientDurability: NodeJS.Timeout | undefined;

const MONGO_CLIENT_DEFAULT_DURABILITY = TimeSpan.toMillieSeconds({
    min: 5,
});

export async function mongoConnection<T>(task: (db: Db) => Promise<T>): Promise<T> {
    if (!globalMongoClient) {
        let mongoUrl = getEnvironment().MONGO_URL;
        if (!mongoUrl) {
            throw new Error('Environment variable MONGO_URL not set!');
        }
        globalMongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }
    if (mongoClientDurability) {
        clearTimeout(mongoClientDurability);
    }
    setTimeout(() => {
        if (globalMongoClient) {
            globalMongoClient.close();
            globalMongoClient = undefined;
        }
    }, MONGO_CLIENT_DEFAULT_DURABILITY);
    const mongoDbName = getEnvironment().MONGO_DB_NAME;
    if (!mongoDbName) {
        throw new Error(`Environment variable MONGO_DB_NAME not set!`);
    }
    const db = globalMongoClient.db(mongoDbName);
    const result: T = await task(db);
    return result;
}

export class Mongo {
    private static instance: Mongo | undefined;
    private constructor() { }
    public static getInstance(): Mongo {
        if (!this.instance) {
            this.instance = new Mongo();
        }
        return this.instance;
    }

    public createAllIndices(): Promise<void> {
        return mongoConnection(async (db) => {
            await Promise.all([
                Calendar.getInstance().getCollection(db).createIndex({ year: 1 }),
                Calendar.getInstance().getCollection(db).createIndex({ month: 1 }),
                File.getInstance().getCollection(db).createIndex({ id: 1 }),
                File.getInstance().getCollection(db).createIndex({ name: 1 }),
                Menu.getInstance().getCollection(db).createIndex({ id: 1 }),
                Pages.getInstance().createIndex(db),
                Permissions.getInstance().getCollection(db).createIndex({ groupId: 1 }),
                Sermon.getInstance().getCollection(db).createIndex({ id: 1 }),
                Preacher.getInstance().createIndex(db),
            ]);
        });
    }
}

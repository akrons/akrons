import { MongoClient, Db } from 'mongodb';
import { TimeSpan } from './time-span';
import { Environment } from './env';


let globalMongoClient: MongoClient | undefined;
let mongoClientDurability: NodeJS.Timeout | undefined;

let MONGO_CLIENT_DEFAULT_DURABILITY: number | undefined;
function getDefaultMongoClientDurability(): number {
    if (MONGO_CLIENT_DEFAULT_DURABILITY) {
        return MONGO_CLIENT_DEFAULT_DURABILITY;
    }
    MONGO_CLIENT_DEFAULT_DURABILITY = TimeSpan.toMillieSeconds(Environment.get().mongo.clientDefaultDurability)
    return MONGO_CLIENT_DEFAULT_DURABILITY;
}

export async function mongoConnection<T>(task: (db: Db) => Promise<T>): Promise<T> {
    if (!globalMongoClient) {
        let mongoUrl = Environment.get().mongo.mongoDb;
        globalMongoClient = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    }
    if (mongoClientDurability) {
        clearTimeout(mongoClientDurability);
    }
    mongoClientDurability = setTimeout(() => {
        if (globalMongoClient) {
            globalMongoClient.close();
            globalMongoClient = undefined;
        }
    }, getDefaultMongoClientDurability());
    const mongoDbName = Environment.get().mongo.database;
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

    // public createAllIndices(): Promise<void> {
    //     return mongoConnection(async (db) => {
    //         await Promise.all([
    //             Groups.getInstance().createIndex(db),
    //             Users.getInstance().createIndex(db),
    //         ]);
    //     });
    // }
}

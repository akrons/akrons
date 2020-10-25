import { mongoConnection } from "./mongo";
import { BadRequestError } from "@akrons/service-utils";

export class JsonImport {
    private static instance: JsonImport | undefined;
    public static getInstance(): JsonImport {
        if (!this.instance) {
            this.instance = new JsonImport();
        }
        return this.instance;
    }
    private constructor() { }

    importOne(collection?: string, object?: object): Promise<string> {
        if (!collection || !object) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            let res = await db.collection(collection).insertOne(object);
            return res.insertedId;
        });
    }

    importMany(collection?: string, objects?: object[]): Promise<string[]> {
        if (!collection || !objects) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            let res = await db.collection(collection).insertMany(objects);
            const ids = [];
            for (let i in res.insertedIds) {
                ids.push(res.insertedIds[i]);
            }
            return ids;
        });
    }
}

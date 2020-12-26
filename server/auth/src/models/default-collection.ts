import { Db, Collection } from 'mongodb';
import { mongoConnection } from '../lib/mongo';
import { BadRequestError, NotFoundError, ConflictError } from '@akrons/service-utils';
import * as uuid from 'uuid';

export abstract class DefaultCollection<R, S extends R & Partial<IHaseId>, T extends IHaseId> {

    allowRandomId: boolean = false;

    getAll(): Promise<T[]> {
        return mongoConnection(async (db) => {
            return await this.getCollection(db).find({}).toArray();
        });
    }

    get(id?: string): Promise<T> {
        if (!id) throw new BadRequestError();
        return mongoConnection(async (db) => {
            let result: T = <any>await this._getCollection(db).findOne({ id: id });
            if (!result) {
                throw new NotFoundError();
            }
            return result;
        });
    }

    exists(id?: string): Promise<boolean> {
        if (!id) throw new BadRequestError();
        return mongoConnection(async (db) => {
            const count = await this._getCollection(db).count({ id: id });
            return count !== 0;
        });
    }

    async create(id?: string, newElement?: R): Promise<T> {
        if (!id) {
            if (!this.allowRandomId) {
                throw new BadRequestError();
            }
            return await this.create(uuid.v4(), newElement);
        }
        if (!newElement) throw new BadRequestError();
        return mongoConnection(async (db) => {
            if (await this.exists(id)) {
                throw new ConflictError(`The record '${id}' already exists.`);
            }
            const result = this.insertMap(id, newElement);
            await this._getCollection(db).insertOne(result);
            return result;
        });
    }

    async update(id?: string, updated?: S): Promise<void> {
        if (!id) {
            if (!this.allowRandomId) {
                throw new BadRequestError();
            }
            await this.create(uuid.v4(), updated);
            return;
        }
        if (!updated) throw new BadRequestError();
        return mongoConnection(async (db) => {
            if (!await this.exists(id)) {
                await this.create(id, updated);
                return;
            }
            if (updated.id && id !== updated.id) {
                if (await this.canMoveId(id, updated)) {
                    if (await this.exists(updated.id)) {
                        throw new ConflictError(`The record '${updated.id}' already exists.`);
                    }
                    await this._getCollection(db).updateOne({ id: id }, { $set: { ... this.updateMap(updated), id: updated.id } });
                    return;
                } else {
                    throw new BadRequestError();
                }
            }
            await this._getCollection(db).updateOne({ id: id }, { $set: { ... this.updateMap(updated) } });
        });
    }

    delete(id?: string): Promise<void> {
        if (!id) throw new BadRequestError();
        return mongoConnection(async (db) => {
            await this._getCollection(db).deleteOne({ id: id });
        });
    }

    abstract createIndex(db: Db): Promise<void>;
    abstract canMoveId(id: string, x: S): Promise<boolean>;
    abstract updateMap(x: S): Partial<T>;
    abstract insertMap(id: string, x: R): T;
    abstract getCollection(db: Db): Collection<T>;

    // Workaround, because the mongo selectors with generic types are fishy
    private _getCollection(db: Db): Collection<IHaseId> {
        return <any>this.getCollection(db);
    }
}

interface IHaseId {
    id: string;
}

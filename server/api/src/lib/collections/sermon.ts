import { ISermon } from '../../models';
import { mongoConnection } from '../mongo';
import { isPast } from 'date-fns';
import { BadRequestError, NotFoundError, GoneError, IServiceError } from '@akrons/service-utils';
import { Db } from 'mongodb';
import * as Path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { getEnvironment } from '../env';
import { Views } from './views';
import { Preacher } from './preacher';

export class Sermon {
    private static instance: Sermon | undefined;
    public static getInstance(): Sermon {
        if (!this.instance) {
            Sermon.instance = new Sermon();
        }
        return Sermon.instance!;
    }

    private constructor() { }

    public sermonStorageDirectory = Path.join(getEnvironment().FILES_DIR, getEnvironment().SERMON_SUB_DIR);

    create(id: string, name: string): Promise<void> {
        return mongoConnection(async (db) => {
            await this.getCollection(db).insertOne({
                id: id,
                date: new Date(),
                preacher: { id: undefined, name: '' },
                title: `Upload {${id}} Dateiname: ${name}`,
                availableUntil: new Date('2000-01-01'),
            });
        });
    }

    getFilePath(id?: string): Promise<string> {
        if (!id) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            let sermon = await this.getCollection(db).findOne({
                $or: [
                    { rowKey: id },
                    { id: id },
                ]
            });
            if (!sermon) {
                throw new NotFoundError();
            }
            if ((sermon.availableUntil && isPast(new Date(sermon.availableUntil)))) {
                throw new GoneError('sermon');
            }
            await Views.getInstance().count('sermon', sermon.id);
            return Path.join(this.sermonStorageDirectory, sermon.id);
        });
    }

    getMetadata(id?: string): Promise<ISermon> {
        if (!id) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            let sermon = await this.getCollection(db).findOne({
                $or: [
                    { rowKey: id },
                    { id: id },
                ]
            });
            if (!sermon) {
                throw new NotFoundError();
            }
            return this.addPreacherToSermon(sermon);
        });
    }

    update(id?: string, updated?: ISermon): Promise<void> {
        if (!id || !updated) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            await this.getCollection(db).updateOne({
                $or: [
                    { rowKey: id },
                    { id: id },
                ]
            }, {
                $set: {
                    rowKey: undefined,
                    datum: undefined,
                    prediger: undefined,
                    verfuegbarbis: undefined,
                    id: id,
                    titel: updated.title,
                    date: updated.date,
                    preacher: {
                        id: updated.preacher ? updated.preacher.id : undefined,
                    },
                    title: updated.title,
                    availableUntil: updated.availableUntil,
                },
            });
        });
    }

    delete(id?: string): Promise<void> {
        return mongoConnection(async (db) => {
            const collection = this.getCollection(db);
            const sermon = await collection.findOne({
                $or: [
                    { rowKey: id },
                    { id: id },
                ]
            });
            if (!sermon) {
                throw new NotFoundError();
            }
            const filePath = Path.join(this.sermonStorageDirectory, sermon.id);
            await promisify(fs.unlink)(filePath)
                .catch(err => {
                    console.error(`could not delete file '${filePath}'`, err);
                });

            await collection.deleteOne({
                $or: [
                    { rowKey: id },
                    { id: id },
                ]
            });
        });
    }

    async loadPublicSermons(): Promise<ISermon[]> {
        let all = await this.loadAllSermons();
        return all.filter(sermon => {
            if (sermon.availableUntil) {
                return !isPast(new Date(sermon.availableUntil));
            }
            return true;
        });
    }

    loadAllSermons(): Promise<ISermon[]> {
        return mongoConnection(async (db) => {
            let result = await this.getCollection(db).find({}).toArray();
            await Promise.all(result.map(this.addPreacherToSermon));
            return result;
        });
    }

    private async addPreacherToSermon(sermon: ISermon): Promise<ISermon> {
        if (typeof sermon.preacher === 'string') {
            sermon.preacher = {
                id: undefined,
                name: sermon.preacher,
            };
            return sermon;
        }
        if (!sermon.preacher.id) {
            sermon.preacher = {
                id: undefined,
                name: '',
            };
            return sermon;
        }
        try {
            const preacher = await Preacher.getInstance().get(sermon.preacher.id);
            sermon.preacher.name = preacher.name;
        } catch (err) {
            if ((err as IServiceError).statusCode === 404) {
                sermon.preacher.name = '[Prediger gelöscht]';
            } else {
                throw err;
            }
        }
        return sermon;
    }

    getCollection(db: Db) {
        return db.collection<ISermon>('sermon');
    }

}

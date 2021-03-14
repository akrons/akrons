import { Db, Collection } from 'mongodb';
import { mongoConnection } from '../mongo';
import { NotFoundError, PayloadToLarge, NotAuthorizedError, BadRequestError, ConflictError } from '@akrons/service-utils';
import { hasPermission } from '@akrons/common-auth';
import * as Path from 'path';
import { getEnvironment } from '../env';
import { Views } from './views';
import { promises as fsPromises } from 'fs';
import { v4 } from 'uuid';
import { FileFilterCallback } from 'multer';
import { Request } from 'express';

export class File {
    private static instance: File | undefined;


    fileStorageDirectory = getEnvironment().FILES_DIR;
    private reservedStorage: Map<string, number> = new Map();

    private constructor() { }
    public static getInstance(): File {
        if (!File.instance) {
            File.instance = new File();
        }
        return File.instance;
    }

    getFile(name?: string, permissions?: string[]): Promise<{ file: IFile, path: string }> {
        if (!name) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            let file = await this.getCollection(db).findOne({ name, });
            if (!file) {
                throw new NotFoundError();
            }
            if (permissions && !hasPermission(file.permission, permissions)) {
                throw new NotAuthorizedError();
            }
            await Views.getInstance().count('file', file.id);
            return {
                file,
                path: Path.join(this.fileStorageDirectory, file.id),
            };
        });
    }

    create(id?: string, fileName?: string, mimeType?: string): Promise<void> {
        if (!id || !fileName) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            if (await this.exists(fileName)) {
                throw new ConflictError(`The file '${fileName}' already exists.`);
            }
            await this.getCollection(db).insertOne({
                id,
                name: fileName,
                permission: 'api.common.file',
                mimeType: mimeType || 'application/octet-stream',
                cachePolicy: 604800, // 1 Week
            });
        });
    }

    update(id?: string, file?: IFile): Promise<void> {
        if (!id || !file) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            if (await this.exists(file.name, id)) {
                throw new ConflictError(`The file '${file.name}' already exists.`);
            }
            await this.getCollection(db).updateOne(
                { id },
                {
                    $set: {
                        name: file.name,
                        permission: file.permission,
                        mimeType: file.mimeType,
                        cachePolicy: file.cachePolicy,
                    },
                },
            );
        });
    }

    delete(id?: string): Promise<void> {
        if (!id) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            await this.getCollection(db).deleteOne({
                id,
            });
        });
    }

    async deleteByName(name?: string): Promise<void> {
        let f = await this.getFile(name);
        await this.delete(f.file.id);
    }

    readOne(id?: string, permissions?: string[]): Promise<IFile> {
        if (!id) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            const result = await this.getCollection(db).findOne({ id });
            if (!result) {
                throw new NotFoundError();
            }
            if (permissions && !hasPermission(result.permission, permissions)) {
                throw new NotAuthorizedError();
            }
            return result;
        });
    }

    readAll(): Promise<IFile[]> {
        return mongoConnection(async (db) => {
            return await this.getCollection(db).find({}).toArray();
        });
    }

    exists(fileName: string, notId?: string): Promise<boolean> {
        return mongoConnection(async (db) => {
            let existingFilesWithName = await this.getCollection(db).find({
                name: fileName,
                ...(notId ? {
                    id: {
                        $not: {
                            $eq: notId
                        }
                    }
                } : {})
            }).toArray();
            return existingFilesWithName.length !== 0;
        });
    }

    async getStorageUsage(directory: string = this.fileStorageDirectory): Promise<number> {
        let usage = await this.getStorageUsageRecursive(directory);
        let reservedUsage = 0;
        this.reservedStorage.forEach((value) => {
            reservedUsage += value;
        });
        return usage + reservedUsage;
    }

    reserve(size: number): string {
        let token = v4();
        this.reservedStorage.set(token, size);
        return token;
    }

    releaseReservation(token: string): void {
        this.reservedStorage.delete(token);
    }

    async multerFileFilter(req: Request, file: Express.Multer.File, callback: FileFilterCallback): Promise<void> {
        if (!getEnvironment().STORAGE_BYTE_LIMIT) {
            callback(null, true);
            return;
        }
        if (!req.headers['content-length']) {
            callback(new BadRequestError());
            return;
        }
        const fileSize = Number.parseInt(req.headers['content-length']);
        let storageUsage = await File.getInstance().getStorageUsage();
        const storageLimit = Number.parseInt(getEnvironment().STORAGE_BYTE_LIMIT!);
        if (storageLimit < storageUsage + fileSize) {
            callback(new PayloadToLarge(fileSize, storageLimit));
            return;
        }
        req.fileStorageReservationToken = File.getInstance().reserve(fileSize);
        callback(null, true);
    }


    getCollection(db: Db): Collection<IFile> {
        return db.collection('file');
    }

    private async getStorageUsageRecursive(directory: string = this.fileStorageDirectory): Promise<number> {
        let stats = await fsPromises.lstat(directory);
        if (stats.isFile()) {
            return stats.size;
        } else if (stats.isDirectory()) {
            let list = await fsPromises.readdir(directory);
            let subDirSizes = await Promise.all(list.map(subDirectory => this.getStorageUsageRecursive(Path.join(directory, subDirectory))));
            return subDirSizes.reduce((acc, x) => acc + x, 0);
        } else {
            return 0;
        }
    }
}

export interface IFile {
    id: string;
    name: string;
    permission: string;
    mimeType: string;
    cachePolicy: number;
}

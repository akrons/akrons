import { Db, Collection } from 'mongodb';
import { DefaultCollection } from './default-collection';
import { generateSalt, hashPassword, generateRandomHexString } from '../lib/crypto';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@akrons/service-utils';
import { mongoConnection } from '../lib/mongo';
import { Environment } from '../lib/env';
import { IInsertUser, IUser } from '@akrons/common-auth';

export class Users extends DefaultCollection<IInsertUser, IUser, IUser> {

    allowRandomId = true;

    private static instance: Users | undefined;
    private constructor() {
        super();
    }

    public static getInstance(): Users {
        if (!Users.instance) {
            Users.instance = new Users();
        }
        return Users.instance;
    }

    async userWithLoginExists(username: string): Promise<boolean> {
        return await mongoConnection(async db => {
            const user = await this.getCollection(db).findOne({
                login: username,
            });
            return Boolean(user);
        });
    }

    async getUserByLoginName(username: string): Promise<IUser> {
        return await mongoConnection(async db => {
            const user = await this.getCollection(db).findOne({
                login: username,
            });
            if (!user) {
                throw new NotFoundError();
            }
            return user;
        });
    }

    async checkLogin(username: string, password: string): Promise<IUser> {
        return await mongoConnection(async db => {
            const user = await this.getCollection(db).findOne({
                login: username,
            });
            if (!user) {
                throw new NotAuthorizedError();
            }
            await this.checkPassword(user, password);
            return user;
        });
    }

    async createUser(user?: IUser): Promise<{ id: string, password: string }> {
        if (!user) {
            throw new BadRequestError();
        }
        const newUser = await this.create(undefined, user);
        const newPassword = generateRandomHexString(Environment.get().defaultPasswordLength / 2);
        await this.setPassword(newUser, newPassword, true);
        return { id: newUser.id, password: newPassword };
    }

    async checkPasswordById(userId: string, password: string): Promise<void> {
        const user = await this.get(userId);
        return this.checkPassword(user, password);
    }

    async changePasswordById(userId?: string, oldPassword?: string, newPassword?: string): Promise<void> {
        if (!userId || !oldPassword || !newPassword) {
            throw new BadRequestError();
        }
        const user = await this.get(userId);
        return this.changePassword(user, oldPassword, newPassword);
    }

    async setPasswordById(userId?: string, newPassword?: string): Promise<void> {
        if (!userId || !newPassword) {
            throw new BadRequestError();
        }
        const user = await this.get(userId);
        return this.setPassword(user, newPassword);
    }

    async checkPassword(user: IUser, password: string): Promise<void> {
        const givenPasswordHash = hashPassword(password, user.passwordSalt);
        if (givenPasswordHash !== user.passwordHash)
            throw new NotAuthorizedError();
    }

    async changePasswordByLogin(login?: string, oldPassword?: string, newPassword?: string): Promise<void> {
        if (!login || !oldPassword || !newPassword) {
            throw new BadRequestError();
        }
        const user = await this.getUserByLoginName(login);
        await this.changePassword(user, oldPassword, newPassword);
    }

    async changePassword(user: IUser, oldPassword: string, newPassword: string): Promise<void> {
        await this.checkPassword(user, oldPassword);
        await this.setPassword(user, newPassword);
    }

    async setPassword(user: IUser, newPassword: string, passwordChangeRequired: boolean = false) {
        const newSalt = generateSalt();
        const newPasswordHash = hashPassword(newPassword, newSalt);
        await mongoConnection(async (db) => {
            await this.getCollection(db).updateOne(
                { id: user.id },
                {
                    $set: {
                        passwordHash: newPasswordHash,
                        passwordSalt: newSalt,
                        passwordChangeRequired,
                    }
                }
            );
        });
    }

    async createIndex(db: Db): Promise<void> {
        await this.getCollection(db).createIndex({ id: 1 });
        await this.getCollection(db).createIndex({ login: 1 });
    }

    async canMoveId(id: string, x: IUser): Promise<boolean> {
        return false;
    }

    updateMap(x: IUser): Partial<IUser> {
        return {
            login: x.login,
            groups: x.groups,
            passwordChangeRequired: x.passwordChangeRequired,
        }
    }

    insertMap(id: string, x: IInsertUser): IUser {
        return {
            id: id,
            login: x.login,
            passwordHash: '',
            passwordSalt: '',
            groups: x.groups || [],
            passwordChangeRequired: true,
        }
    }

    getCollection(db: Db): Collection<IUser> {
        return db.collection('users');
    }

}

import { GraphInterfaces } from "../graph/interfaces";
import { getApiOauthToken } from "../auth/api-auth";
import { getAuthenticatedGraphClient } from "../graph/graph-client";
import { mongoConnection } from "../mongo";
import { Db, Collection } from "mongodb";
import express from 'express';
import { NotAuthorizedError, BadRequestError } from "@akrons/service-utils";
import { getEnvironment } from "../env";

export class Permissions {
    private static instance: Permissions | undefined;
    static getInstance(): Permissions {
        if (!this.instance) {
            this.instance = new Permissions();
        }
        return this.instance;
    }

    static requireMiddleware(permission: string): express.RequestHandler {
        return (req, res, next): void => {
            next();
            return;
            if (!Permissions.getInstance().hasPermission(permission, req.permissions)) {
                console.log('has Permissions:', req.permissions);
                next(new NotAuthorizedError('permission required: ' + permission));
            }
            next();
        };
    }

    static setDefaultPermissionsMiddleware(): express.RequestHandler {
        return (req, res, next): void => {
            Permissions.getInstance().getDefaultPermissions()
                .then(permissions => {
                    req.permissions = permissions;
                    if (getEnvironment().DISABLE_AUTHORIZATION) {
                        req.permissions = ['api.*'];
                    }
                    next();
                });
        };
    }

    async loadUserPermissions(user: { id?: string, mail: string }): Promise<string[]> {
        let apiAuthToken = await getApiOauthToken();
        let graphClient = getAuthenticatedGraphClient(apiAuthToken);
        let userGroups: GraphInterfaces.IMemberResult = await graphClient.api(`/users/${user.id || user.mail}/transitiveMemberOf`).get();
        if (user.mail === getEnvironment().ROOT_ADMIN) {
            return ['api.*'];
        }
        return await this.loadPermissionsForGroups(userGroups);
    }

    async loadGroupPermissionsByEmail(groupEmail: string): Promise<string[]> {
        let apiAuthToken = await getApiOauthToken();
        let graphClient = getAuthenticatedGraphClient(apiAuthToken);
        let group: GraphInterfaces.IMemberResult = await graphClient
            .api(`/groups/`)
            .query({ $filter: `mail+eq+'${groupEmail}'` })
            .get();
        return await this.loadPermissionsForGroups(group);
    }


    hasPermission(requiredPerission: string, permissions: string[]): boolean {
        if (getEnvironment().DISABLE_AUTHORIZATION) {
            return true;
        }
        if (!requiredPerission) {
            throw new Error('hasPermission failed; requiredPerission is Empty!');
        }
        for (let permission of permissions) {
            if (!permissions) { // undefined or empty string are no permissions
                continue;
            }
            if (permission.startsWith(requiredPerission + '.') || requiredPerission === permission) {
                return true;
            }
            if (permission.endsWith('.*')) {
                let wildecardPermissionRoot = permission.substring(0, permission.length - 2);
                if (requiredPerission.startsWith(wildecardPermissionRoot + '.') || requiredPerission === wildecardPermissionRoot) {
                    return true;
                }
            }
        }
        return false;
    }

    loadAllPermissionConfigs(): Promise<IPermissionConfig[]> {
        return mongoConnection(async (db) => {
            return await this.getCollection(db).find({}).toArray();
        });
    }

    updatePermissionConfig(groupId?: string, permissions?: string[]): Promise<void> {
        if (!groupId || !permissions) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            const collection = this.getCollection(db);
            const configExists = await collection.findOne({ groupId: groupId });
            if (configExists) {
                await collection.updateOne({
                    groupId: groupId,
                }, {
                    $set: {
                        permissions: permissions,
                    }
                });
            } else {
                await collection.insertOne({
                    groupId: groupId,
                    permissions: permissions,
                });
            }
        });
    }

    deletePermissionConfig(groupId?: string): Promise<void> {
        if (!groupId) {
            throw new BadRequestError();
        }
        return mongoConnection(async (db) => {
            const collection = this.getCollection(db);
            await collection.deleteOne({ groupId: groupId });
        });
    }

    getCollection(db: Db): Collection<IPermissionConfig> {
        return db.collection<IPermissionConfig>('permissions');
    }

    defaultPermissionsCache: string[] | undefined;
    async getDefaultPermissions(): Promise<string[]> {
        if (this.defaultPermissionsCache) {
            return this.defaultPermissionsCache;
        }
        return await mongoConnection(async (db) => {
            let permissionConfig = await this.getCollection(db).findOne({
                groupId: 'default',
            });
            if (!permissionConfig) {
                await this.initDefaultPermissions();
                return await this.getDefaultPermissions();
            }
            this.defaultPermissionsCache = permissionConfig.permissions;
            return permissionConfig.permissions;
        });
    }
    authenticatedPermissionsCache: string[] | undefined;
    async getAuthenticatedPermissions(): Promise<string[]> {
        if (this.authenticatedPermissionsCache) {
            return this.authenticatedPermissionsCache;
        }
        return await mongoConnection(async (db) => {
            let permissionConfig = await this.getCollection(db).findOne({
                groupId: 'user',
            });
            if (!permissionConfig) {
                await this.initDefaultPermissions();
                return this.getAuthenticatedPermissions();
            }
            this.authenticatedPermissionsCache = permissionConfig.permissions;
            return permissionConfig.permissions;
        });
    }

    initDefaultPermissions(): Promise<void> {
        return mongoConnection(async (db) => {
            this.getCollection(db).insertMany([
                {
                    "groupId": "default",
                    "permissions": [
                        "api.common.*",
                        "api.auth"
                    ],
                },
                {
                    "groupId": "user",
                    "permissions": [
                        "api.common.*",
                        "api.auth",
                        "api.auth.permissions.read"
                    ],
                },
            ]);
        });

    }

    private loadPermissionsForGroups(groups: GraphInterfaces.IMemberResult): Promise<string[]> {
        return mongoConnection(async (db) => {
            const userPermissions = await this.getAuthenticatedPermissions();
            if (!groups.value || groups.value.length === 0) {
                return userPermissions;
            }
            let permissionConfigs = await this.getCollection(db).find({
                $or: groups.value.map(x => ({ groupId: x.id }))
            }).toArray();
            return permissionConfigs.reduce((acc: string[], val: IPermissionConfig) => [...acc, ...val.permissions], userPermissions);
        });

    }
}

interface IPermissionConfig {
    groupId: string;
    permissions: string[];
}

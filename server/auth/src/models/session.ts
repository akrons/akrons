import { BadRequestError, NotAuthorizedError } from '@akrons/service-utils';
import { Users } from './users';
import { isPast } from 'date-fns';
import { Groups } from './groups';
import { Token } from './token';
import { auth } from '@akrons/types';

export class Session {

    private static instance: Session | undefined;
    private constructor() { }

    public static getInstance(): Session {
        if (!Session.instance) {
            Session.instance = new Session();
        }
        return Session.instance;
    }

    public async login(userName?: string, password?: string): Promise<string> {
        if (!userName || !password) {
            throw new BadRequestError();
        }
        const user = await Users.getInstance().checkLogin(userName, password);
        if (user.passwordChangeRequired) {
            throw new PasswordChangeRequiredError();
        }
        const permissions: string[] = [];
        for (let groupId of user.groups) {
            const group = await Groups.getInstance().get(groupId);
            permissions.push(...group.permissions);
        }
        const token = await Token.getInstance().create(user.id, user.login, permissions);
        return await Token.getInstance().sign(token);
    }

    public async updateToken(token?: auth.SessionToken): Promise<string> {
        if (!token) {
            throw new BadRequestError();
        }
        if (isPast(token.renewableUntil)) {
            throw new NotAuthorizedError();
        }
        await Token.getInstance().check(token);
        await Token.getInstance().destroy(token);
        const newToken = await Token.getInstance().create(token.userId, token.userName, token.permissions);
        return await Token.getInstance().sign(newToken);

    }

    public async logout(token?: auth.SessionToken): Promise<void> {
        if (!token) {
            throw new BadRequestError();
        }
        await Token.getInstance().destroy(token);
    }
}

export class PasswordChangeRequiredError extends Error {
    constructor() {
        super('passwordChangeRequired')
    }
}

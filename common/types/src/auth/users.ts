export interface IUser extends IInsertUser, IUpdateUser {
    id: string;
    login: string;
    passwordHash: string;
    passwordSalt: string;
    groups: string[];
    passwordChangeRequired: boolean;
}

export interface IInsertUser {
    login: string;
    groups?: string[];
}

export interface IUpdateUser {
    login: string;
    groups: string[];
    passwordChangeRequired: boolean;
}

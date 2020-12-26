export interface IGroup extends IInsertGroup {
    id: string;
}

export interface IInsertGroup {
    name: string;
    permissions: string[];
}

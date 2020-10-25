export interface IMenu {
    id: string;
    menu: IMenuNode[];
}

export interface IClientMenuNode {
    title: string;
    path: string;
    children?: IClientMenuNode[];
    external?: boolean;
}

export interface IMenuNode {
    title: string;
    path: string;
    children?: IMenuNode[];
    external?: boolean;
    permission?: string;
}

import { IPayload } from './payload';

export interface IPage {
    elements: IPayload[];
    title: string;
    id: string;
    options: { key: string, value: any}[];
}

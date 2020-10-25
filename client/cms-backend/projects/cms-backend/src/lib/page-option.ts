import { IFormElementModel } from '@akrons/forms';

export interface IPageOption<key extends string> {
    key: key;
    form: IFormElementModel & { id: key };
    description: string;
}

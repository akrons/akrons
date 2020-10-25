import { cms } from '@akrons/types';
import { IFormModel, IButtonFunction } from '@akrons/forms';


export interface IElementDefinition<T extends object> {
    type: string;
    editorForm: (data: T) => IFormModel;
    functions: IButtonFunction[];
    preSave?: (element: T, page: cms.IPage) => void;
    create: () => T;
    icon: string;
    name: string;
}

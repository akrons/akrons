import { IElementDefinition } from '@akrons/cms-backend';
import { ITitleElementData } from '@akrons/cms-default';

export const TitleElement: IElementDefinition<ITitleElementData> = {
    type: 'title',
    create: () => ({ text: '', level: 1 }),
    editorForm: (data: ITitleElementData) => ({
        elements: [
            {
                id: 'text',
                type: 'input',
                placeholder: { type: 'static', value: 'Inhalt:' },
                default: { type: 'static', value: data.text },
            },
            {
                id: 'level',
                type: 'select',
                options: { type: 'static', value: <any>[1, 2, 3, 4, 5, 6] },
                default: { type: 'static', value: <any>data.level },
            }
        ]
    }),
    functions: [],
    icon: 'title',
    name: 'Titel',
};

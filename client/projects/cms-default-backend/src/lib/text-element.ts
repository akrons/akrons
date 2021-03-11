import { IElementDefinition } from '@akrons/cms-backend';
import { ITextElementData } from '@akrons/cms-default';

export const TextElement: IElementDefinition<ITextElementData> = {
    type: 'text',
    create: () => ({ text: '' }),
    editorForm: (data: ITextElementData) => ({
        elements: [
            {
                id: 'text',
                type: 'textarea',
                placeholder: { type: 'static', value: 'Inhalt:' },
                default: { type: 'static', value: data.text },
            }
        ]
    }),
    functions: [],
    icon: 'text_fields',
    name: 'Text',
};

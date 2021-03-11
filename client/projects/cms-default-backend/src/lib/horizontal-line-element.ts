import { IElementDefinition } from '@akrons/cms-backend';
import { IImageElementData } from '@akrons/cms-default';

export const HorizontalLineElement: IElementDefinition<{}> = {
    type: 'horizontal-line',
    create: () => ({}),
    editorForm: (data: IImageElementData) => ({
        elements: []
    }),
    functions: [ ],
    icon: 'minimize',
    name: 'Trennlinie',
};

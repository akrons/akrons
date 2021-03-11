import { DialogStaticService } from '@akrons/core';
import { IElementDefinition } from '@akrons/cms-backend';
import { IImageElementData } from '@akrons/cms-default';
import { ImageSelectorComponent } from '@akrons/files-backend';
import { IFormModel } from '@akrons/forms';
import { BehaviorSubject } from 'rxjs';

export const ImageElement: IElementDefinition<IImageElementData> = {
    type: 'image',
    create: () => ({ url: '', description: '', width: 50, fixed: false, height: 0, heightUnit: 'auto' }),
    editorForm: (data: IImageElementData) => ({
        elements: [
            {
                id: 'selectPhoto',
                type: 'button',
                function: { type: 'static', value: 'selectPhoto' },
                text: { type: 'static', value: 'Bild auswählen' },
                color: { type: 'dynamic', unCompiledFunction: '$url.value.isEmpty.ifElse("primary","secondary")' },
                disabled: { type: 'static', value: false }
            },
            {
                id: 'url',
                type: 'input',
                placeholder: { type: 'static', value: 'Link/url:' },
                default: { type: 'static', value: data.url },
            },
            {
                id: 'width',
                type: 'slider',
                label: { type: 'static', value: 'Breite:' },
                min: { type: 'static', value: 0 },
                max: { type: 'static', value: 100 },
                step: { type: 'static', value: 1 },
                default: { type: 'static', value: data.width },
            },
            {
                id: 'heightUnit',
                type: 'select',
                title: { type: 'static', value: 'Höhe Maßeinheit' },
                options: { type: 'static', value: ['auto', 'px', '%', 'vh', 'pt'] },
                default: { type: 'static', value: data.heightUnit },
            },
            {
                id: 'height',
                type: 'slider',
                label: { type: 'static', value: 'Höhe:' },
                min: { type: 'static', value: 0 },
                max: { type: 'dynamic', unCompiledFunction: '(($heightUnit.value == ("%")) || ($heightUnit.value == "vh")).ifElse(100, ($heightUnit.value == "px").ifElse(2000, 50))' },
                step: { type: 'static', value: 1 },
                default: { type: 'static', value: data.height },
                visible: { type: 'dynamic', unCompiledFunction: '$heightUnit.value != "auto"' }
            },
            {
                id: 'description',
                type: 'textarea',
                placeholder: { type: 'static', value: 'Beschreibung:' },
                default: { type: 'static', value: data.description },
            },
            {
                id: 'fixed',
                type: 'slide',
                text: { type: 'static', value: 'Bild Fixiert' },
                default: { type: 'static', value: data.fixed }
            }
        ]
    }),
    functions: [
        {
            name: 'selectPhoto', action: (formModel$: BehaviorSubject<IFormModel>) => {
                openImageSelectDialog()
                    .then(x => {
                        const formModel = formModel$.value;
                        const urlElement = formModel.elements.find(x => x.id === 'url');
                        urlElement.default = { type: 'static', value: x };
                        formModel$.next(formModel);
                    });
            }
        }
    ],
    icon: 'insert_photo',
    name: 'Bild',
};

function openImageSelectDialog(): Promise<string> {
    return new Promise(resolve => {
        DialogStaticService.next({
            component: ImageSelectorComponent,
            config: {
                height: '500px',
                width: '600px',
                closeOnNavigation: false,
                disableClose: false
            },
            dialogRef: dialogRef => dialogRef.afterClosed()
                .subscribe({
                    next: async (result: string | undefined) => {
                        if (result) {
                            resolve(result);
                        }
                    },
                }),
        });
    });
}

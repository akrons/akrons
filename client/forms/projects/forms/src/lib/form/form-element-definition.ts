import { IFormElementModel } from './form-element-model';
import { FormDefinition } from './form-definition';
import { InputField } from './fields/input-field-element';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SliderField } from './fields/slider-field-element';
import { SlideField } from './fields/slide-field-element';
import { SelectField } from './fields/select-field-element';
import { ArrayField } from './fields/array-field-element';
import { CheckboxField } from './fields/checkbox-field-element';
import { RadioGroupField } from './fields/radio-group-field-element';
import { ButtonField } from './fields/button-field-element';
import { TextareaField } from './fields/textarea-field-element';

export interface IFormElementDefinition {
    id: string;
    type: string;
    evalValues: () => void;
    getReactiveFormObject: (value?: { [key: string]: any }) => { [key: string]: any };
}


export function FormElementDefinitionFactory(
    model: IFormElementModel,
    parentForm: FormDefinition,
    index: number,
    formGroup$: BehaviorSubject<FormGroup>,
    formBuilder: FormBuilder,
): IFormElementDefinition {
    switch (model.type) {
        case 'array':
            return new ArrayField(model, parentForm, index, formGroup$, formBuilder);
        case 'check':
            return new CheckboxField(model, parentForm, index, formGroup$);
        case 'input':
            return new InputField(model, parentForm, index, formGroup$);
        case 'textarea':
            return new TextareaField(model, parentForm, index, formGroup$);
        case 'radio':
            return new RadioGroupField(model, parentForm, index, formGroup$);
        case 'slider':
            return new SliderField(model, parentForm, index, formGroup$);
        case 'slide':
            return new SlideField(model, parentForm, index, formGroup$);
        case 'select':
            return new SelectField(model, parentForm, index, formGroup$);
        case 'button':
            return new ButtonField(model, parentForm, index, formGroup$);
        default:
            throw new Error(`unknown type ${(model as IFormElementModel).type}`);
    }
}

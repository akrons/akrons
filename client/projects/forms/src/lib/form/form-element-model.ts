import { IEntityModel } from './entity';
import { IInputField } from './fields/input-field-element';
import { ISliderField } from './fields/slider-field-element';
import { ISlideField } from './fields/slide-field-element';
import { ISelectField } from './fields/select-field-element';
import { IArrayField } from './fields/array-field-element';
import { ICheckboxField } from './fields/checkbox-field-element';
import { IRadioGroupField } from './fields/radio-group-field-element';
import { IButtonField } from './fields/button-field-element';
import { ITextareaField } from './fields/textarea-field-element';

export type IFormElementModel = IInputField
| ITextareaField
| ISliderField
| ISlideField
| ISelectField
| ICheckboxField
| IRadioGroupField
| IArrayField
| IButtonField;

export interface IFormField {
    type: string;
    id?: number | string;
    default?: IEntityModel<string | number | boolean | string[]>;
}

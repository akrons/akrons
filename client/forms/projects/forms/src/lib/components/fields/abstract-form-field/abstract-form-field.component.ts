import { FormGroup } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { IFormElementDefinition } from '../../../form/form-element-definition';

@Directive()
export abstract class AbstractFormFieldComponent<T extends IFormElementDefinition> {

    @Input() XFormField: T;
    @Input() XFormGroup: FormGroup;

    constructor() { }

}

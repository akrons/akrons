import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { InputField } from '../../../form/fields/input-field-element';

@Component({
    selector: 'dynamic-reactive-forms-textarea-element',
    templateUrl: './textarea-element.component.html',
    styleUrls: ['./textarea-element.component.less'],
})
export class TextareaElementComponent extends AbstractFormFieldComponent<InputField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}

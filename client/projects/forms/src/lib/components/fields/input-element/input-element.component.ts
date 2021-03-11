import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { InputField } from '../../../form/fields/input-field-element';

@Component({
    selector: 'dynamic-reactive-forms-input-element',
    templateUrl: './input-element.component.html',
    styleUrls: ['./input-element.component.less'],
})
export class InputElementComponent extends AbstractFormFieldComponent<InputField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}

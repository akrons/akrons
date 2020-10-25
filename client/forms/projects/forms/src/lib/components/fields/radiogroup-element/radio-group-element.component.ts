import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { RadioGroupField } from '../../../form/fields/radio-group-field-element';

@Component({
    selector: 'dynamic-reactive-forms-radio-group-element',
    templateUrl: './radio-group-element.component.html',
    styleUrls: ['./radio-group-element.component.less'],
})
export class RadioGroupElementComponent extends AbstractFormFieldComponent<RadioGroupField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}

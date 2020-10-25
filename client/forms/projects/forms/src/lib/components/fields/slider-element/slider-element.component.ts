import { Component, OnInit } from '@angular/core';
import { AbstractFormFieldComponent } from '../abstract-form-field/abstract-form-field.component';
import { SliderField } from '../../../form/fields/slider-field-element';

@Component({
    selector: 'dynamic-reactive-forms-slider-element',
    templateUrl: './slider-element.component.html',
    styleUrls: ['./slider-element.component.less'],
})
export class SliderElementComponent extends AbstractFormFieldComponent<SliderField> implements OnInit {

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}

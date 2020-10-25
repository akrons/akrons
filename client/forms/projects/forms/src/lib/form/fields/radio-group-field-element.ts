import { IFormElementDefinition } from '../form-element-definition';
import { Entity, EntityFactory, IEntityModel } from '../entity';
import { FormDefinition } from '../form-definition';
import { IFormField } from '../form-element-model';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { IInputField } from './input-field-element';
import { alignType, RADIO_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';

export interface IRadioGroupField extends IFormField {
    type: typeof RADIO_TYPE;
    align?: IEntityModel<alignType>;
    default?: IEntityModel<string>;
    options?: IEntityModel<string[]>;
    disabled?: IEntityModel<boolean>;
    visible?: IEntityModel<boolean>;
}

export class RadioGroupField implements IFormElementDefinition {

    public id: string;
    public type = RADIO_TYPE;
    public align: alignType;
    public default: string;
    public options: string[];
    public otherOption: IInputField;
    public disabled: boolean;
    public visible: boolean;
    alignEntity: Entity<alignType>;
    defaultEntity: Entity<string>;
    optionsEntity: Entity<string[]>;
    disabledEntity: Entity<boolean>;
    visibleEntity: Entity<boolean>;

    constructor(
        model: IRadioGroupField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.alignEntity = EntityFactory(model.align, parentForm, this, 'after');
        this.defaultEntity = EntityFactory(model.default, parentForm, this, '');
        this.optionsEntity = EntityFactory(model.options, parentForm, this, []);
        this.disabledEntity = EntityFactory(model.disabled, parentForm, this, false);
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
    }


    static addFunctionality(functionality: Functionality): void {
        const scopeType = RADIO_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            scopeType,
            name: 'align',
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'string',
                value: scope.align,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'options',
            scopeType,
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'array',
                value: scope.options,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: RadioGroupField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.align = this.alignEntity.value;
        this.default = this.defaultEntity.value;
        this.options = this.optionsEntity.value;
        this.disabled = this.disabledEntity.value;
        this.visible = this.visibleEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        const result = {};
        let setValue;
        if (value && value[this.id]) {
            setValue = value[this.id];
        } else {
            setValue = this.default;
        }
        result[this.id] = [{value: setValue, disabled: this.disabled}];
        return result;
    }


    get value(): string | number {
        const element = this.formGroup$.value.get(this.id);
        if (!element) {
            return this.default;
        }
        return element.value;
    }

}

import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ImportanceColor, CHECK_TYPE, alignType } from './entity-types';
import { Functionality } from 'custom-exp';


export interface ICheckboxField extends IFormField {
    type: typeof CHECK_TYPE;
    text?: IEntityModel<string>;
    align?: IEntityModel<alignType>;
    indeterminate?: IEntityModel<boolean>;
    default?: IEntityModel<boolean>;
    visible?: IEntityModel<boolean>;
    disabled?: IEntityModel<boolean>;
}


export class CheckboxField implements IFormElementDefinition {
    public id: string;
    public type = CHECK_TYPE;

    public text: string;
    public align: alignType;
    public indeterminate: boolean;
    public default: boolean;
    public visible: boolean;
    public disabled: boolean;
    textEntity: Entity<string>;
    alignEntity: Entity<alignType>;
    indeterminateEntity: Entity<boolean>;
    defaultEntity: Entity<boolean>;
    visibleEntity: Entity<boolean>;
    disabledEntity: Entity<boolean>;


    constructor(
        model: ICheckboxField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.textEntity = EntityFactory(model.text, parentForm, this, '');
        this.alignEntity = EntityFactory(model.align, parentForm, this, 'after');
        this.indeterminateEntity = EntityFactory(model.indeterminate, parentForm, this, false);
        this.defaultEntity = EntityFactory(model.default, parentForm, this, false);
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
        this.disabledEntity = EntityFactory(model.disabled, parentForm, this, false);
    }


    static addFunctionality(functionality: Functionality): void {
        const scopeType = CHECK_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: CheckboxField, parameters) => ({
                type: 'boolean',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            scopeType,
            name: 'align',
            eval: (scope: CheckboxField, parameters) => ({
                type: 'string',
                value: scope.align,
            }),
        });
        functionality.addFunctions({
            scopeType,
            name: 'text',
            eval: (scope: CheckboxField, parameters) => ({
                type: 'string',
                value: scope.text,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: CheckboxField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'disabled',
            scopeType,
            eval: (scope: CheckboxField, parameters) => ({
                type: 'boolean',
                value: scope.disabled,
            }),
        });
        functionality.addFunctions({
            name: 'indeterminate',
            scopeType,
            eval: (scope: CheckboxField, parameters) => ({
                type: 'boolean',
                value: scope.indeterminate,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: CheckboxField, parameters) => ({
                type: 'boolean',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: CheckboxField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.text = this.textEntity.value;
        this.align = this.alignEntity.value;
        this.indeterminate = this.indeterminateEntity.value;
        this.default = this.defaultEntity.value;
        this.visible = this.visibleEntity.value;
        this.disabled = this.disabledEntity.value;
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


    get value(): boolean {
        const element = this.formGroup$.value.get(this.id);
        if (!element) {
            return this.default;
        }
        return element.value;
    }
}


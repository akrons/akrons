import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SELECT_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';

export interface ISelectField extends IFormField {
    type: typeof SELECT_TYPE;
    default?: IEntityModel<string>;
    options?: IEntityModel<string[]>;
    title?: IEntityModel<string>;
    visible?: IEntityModel<boolean>;
}

export class SelectField implements IFormElementDefinition {
    public id: string;
    public type = SELECT_TYPE;

    public default: string;
    public visible: boolean;
    public options: string[];
    public title: string;
    defaultEntity: Entity<string>;
    visibleEntity: Entity<boolean>;
    optionsEntity: Entity<string[]>;
    titleEntity: Entity<string>;



    constructor(
        model: ISelectField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.defaultEntity = EntityFactory(model.default, parentForm, this, '');
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
        this.optionsEntity = EntityFactory(model.options, parentForm, this, []);
        this.titleEntity = EntityFactory(model.title, parentForm, this, '');
    }


    static addFunctionality(functionality: Functionality): void {
        const scopeType = SELECT_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: SelectField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: SelectField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'options',
            scopeType,
            eval: (scope: SelectField, parameters) => ({
                type: 'array',
                value: scope.options,
            }),
        });
        functionality.addFunctions({
            name: 'title',
            scopeType,
            eval: (scope: SelectField, parameters) => ({
                type: 'string',
                value: scope.title,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: SelectField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: SelectField, parameters) => ({
                type: 'string',
                value: scope.value,
            }),
        });
    }

    evalValues(): void {
        this.default = this.defaultEntity.value;
        this.visible = this.visibleEntity.value;
        this.options = this.optionsEntity.value;
        this.title = this.titleEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        const result = {};
        if (value && value[this.id]) {
            result[this.id] = [value[this.id]];
        } else {
            result[this.id] = [this.default];
        }
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


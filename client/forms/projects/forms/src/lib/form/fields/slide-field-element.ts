import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ImportanceColor, SLIDE_TYPE } from './entity-types';
import { Functionality } from 'custom-exp';


export interface ISlideField extends IFormField {
    type: typeof SLIDE_TYPE;
    text?: IEntityModel<string>;
    color?: IEntityModel<ImportanceColor>;
    default?: IEntityModel<boolean>;
    visible?: IEntityModel<boolean>;
}

export class SlideField implements IFormElementDefinition {
    public id: string;
    public type = SLIDE_TYPE;

    public text: string;
    public color: ImportanceColor;
    public default: boolean;
    public visible: boolean;
    textEntity: Entity<string>;
    colorEntity: Entity<ImportanceColor>;
    defaultEntity: Entity<boolean>;
    visibleEntity: Entity<boolean>;


    constructor(
        model: ISlideField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.textEntity = EntityFactory(model.text, parentForm, this, '');
        this.colorEntity = EntityFactory(model.color, parentForm, this, 'primary');
        this.defaultEntity = EntityFactory(model.default, parentForm, this, false);
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
    }


    static addFunctionality(functionality: Functionality): void {
        const scopeType = SLIDE_TYPE + '-field';
        functionality.addFunctions({
            scopeType,
            name: 'default',
            eval: (scope: SlideField, parameters) => ({
                type: 'boolean',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: SlideField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'value',
            scopeType,
            eval: (scope: SlideField, parameters) => ({
                type: 'boolean',
                value: scope.value,
            }),
        });
        functionality.addFunctions({
            name: 'text',
            scopeType,
            eval: (scope: SlideField, parameters) => ({
                type: 'string',
                value: scope.text,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: SlideField, parameters) => ({
                type: 'string',
                value: String(scope.value),
            }),
        });
    }

    evalValues(): void {
        this.text = this.textEntity.value;
        this.color = this.colorEntity.value;
        this.default = this.defaultEntity.value;
        this.visible = this.visibleEntity.value;
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


    get value(): boolean {
        const element = this.formGroup$.value.get(this.id);
        if (!element) {
            return this.default;
        }
        return element.value;
    }
}


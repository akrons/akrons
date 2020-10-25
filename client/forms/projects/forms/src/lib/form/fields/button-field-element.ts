import { IEntityModel, Entity, EntityFactory } from '../entity';
import { IFormField } from '../form-element-model';
import { IFormElementDefinition } from '../form-element-definition';
import { FormDefinition } from '../form-definition';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { BUTTON_TYPE, ImportanceColor } from './entity-types';
import { Functionality } from 'custom-exp';

export interface IButtonField extends IFormField {
    type: typeof BUTTON_TYPE;
    text?: IEntityModel<string>;
    visible?: IEntityModel<boolean>;
    disabled?: IEntityModel<boolean>;
    color?: IEntityModel<ImportanceColor>;
    function?: IEntityModel<string>;
    icon?: IEntityModel<string>;
}

export class ButtonField implements IFormElementDefinition {
    public id: string;
    public type = BUTTON_TYPE;
    public text: string;
    public visible: boolean;
    public disabled: boolean;
    public color: ImportanceColor;
    public function: string;
    public icon: string;
    textEntity: Entity<string>;
    visibleEntity: Entity<boolean>;
    disabledEntity: Entity<boolean>;
    colorEntity: Entity<ImportanceColor>;
    functionEntity: Entity<string>;
    iconEntity: Entity<string>;

    constructor(
        model: IButtonField,
        parentForm: FormDefinition,
        private index: number,
        private formGroup$: BehaviorSubject<FormGroup>,
    ) {
        this.id = String(model.id || index);
        this.textEntity = EntityFactory(model.text, parentForm, this, '');
        this.visibleEntity = EntityFactory(model.visible, parentForm, this, true);
        this.disabledEntity = EntityFactory(model.disabled, parentForm, this, false);
        this.colorEntity = EntityFactory(model.color, parentForm, this, 'primary');
        this.functionEntity = EntityFactory(model.function, parentForm, this, '');
        this.iconEntity = EntityFactory(model.icon, parentForm, this, '');
    }

    static addFunctionality(functionality: Functionality): void {
        const scopeType = BUTTON_TYPE + '-field';
        functionality.addFunctions({
            name: 'text',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'string',
                value: scope.text,
            }),
        });
        functionality.addFunctions({
            name: 'visible',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'boolean',
                value: scope.visible,
            }),
        });
        functionality.addFunctions({
            name: 'disabled',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'boolean',
                value: scope.disabled,
            }),
        });
        functionality.addFunctions({
            name: 'color',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'string',
                value: scope.color,
            }),
        });
        functionality.addFunctions({
            name: 'icon',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'string',
                value: scope.icon,
            }),
        });
        functionality.addFunctions({
            name: 'function',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'string',
                value: scope.function,
            }),
        });
        functionality.addFunctions({
            name: 'toString',
            scopeType,
            eval: (scope: ButtonField, parameters) => ({
                type: 'string',
                value: String(scope.type),
            }),
        });
    }

    evalValues(): void {
        this.text = this.textEntity.value;
        this.visible = this.visibleEntity.value;
        this.disabled = this.disabledEntity.value;
        this.color = this.colorEntity.value;
        this.function = this.functionEntity.value;
        this.icon = this.iconEntity.value;
    }

    getReactiveFormObject(value?: { [key: string]: any }): { [key: string]: any } {
        return {};
    }

}


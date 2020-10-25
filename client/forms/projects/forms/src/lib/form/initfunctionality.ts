import { IFormElementDefinition } from './form-element-definition';
import { Functionality, Parameter, evaluateExpression } from 'custom-exp';
import { FormDefinition } from './form-definition';
import { ArrayField } from './fields/array-field-element';
import { CheckboxField } from './fields/checkbox-field-element';
import { InputField } from './fields/input-field-element';
import { RadioGroupField } from './fields/radio-group-field-element';
import { SliderField } from './fields/slider-field-element';
import { SlideField } from './fields/slide-field-element';
import { SelectField } from './fields/select-field-element';
import { TextareaField } from './fields/textarea-field-element';
import { ButtonField } from './fields/button-field-element';

export function InitFunctionality(thisElement: IFormElementDefinition, form: FormDefinition): Functionality {
    const result = new Functionality();
    addIfThanFunction(result);
    addElementField(result, thisElement, 'this');
    form.elements.forEach(element => addElementField(result, element));
    ArrayField.addFunctionality(result);
    CheckboxField.addFunctionality(result);
    InputField.addFunctionality(result);
    TextareaField.addFunctionality(result);
    RadioGroupField.addFunctionality(result);
    SliderField.addFunctionality(result);
    SlideField.addFunctionality(result);
    SelectField.addFunctionality(result);
    ButtonField.addFunctionality(result);
    return result;
}


function addElementField(functionality: Functionality, element: IFormElementDefinition, customId?: string): void {
    functionality.addField({
        name: customId ? customId : element.id,
        eval: () => ({
            type: `${element.type}-field`,
            value: element,
        }),
    });
}

function addIfThanFunction(functionality: Functionality): void {
    functionality.addFunctions({
        name: 'ifElse',
        scopeType: 'boolean',
        eval: (scopeResult: boolean, parameters: Parameter[]) => {
            if (parameters.length !== 2) {
                throw new Error(`Expected 2 parameters but got ${parameters.length}`);
            }
            if (scopeResult) {
                return parameters[0].expression.eval(functionality);
            } else {
                return parameters[1].expression.eval(functionality);
            }
        }
    });
}

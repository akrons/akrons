import { IFormModel, FormDefinition } from '../form/form-definition';
import { BehaviorSubject } from 'rxjs';

export interface IButtonFunction {
    name: string;
    action: (formModel$: BehaviorSubject<IFormModel>, formDefinition: FormDefinition) => void;
}

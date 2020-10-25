import { IFormElementDefinition, FormElementDefinitionFactory } from './form-element-definition';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, skip, switchMap, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IFormElementModel } from './form-element-model';


export interface IFormModel {
    elements: IFormElementModel[];
}

export class FormDefinition {
    public elements: IFormElementDefinition[];
    // public updates$: Subject<void>;
    public formGroup$: BehaviorSubject<FormGroup> = new BehaviorSubject(this.fb.group({}));
    public result: object;
    private lastReactiveFormObject: string;
    private destroy$: Subject<void> = new Subject();

    constructor(
        public fm: IFormModel,
        private fb: FormBuilder,
        private changes$: Subject<object>,
    ) {
        this.elements = fm.elements.reduce(
            (prev, cur) => [...prev, FormElementDefinitionFactory(cur, this, prev.length, this.formGroup$, fb)],
            [],
        );
        this.formGroup$
            .pipe(
                takeUntil(this.destroy$),
                switchMap(formGroup => formGroup.valueChanges),
            )
            .subscribe({
                next: () => {
                    this.formCycle();
                },
            });
        this.formCycle();
    }

    destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    formCycle(): void {
        this.evalAllValues();
        this.result = this.formGroup$.value.value;
        const formObject = this.getReactiveFormObject();
        const formObjectString = JSON.stringify(formObject);
        if (formObjectString === this.lastReactiveFormObject) {
            return;
        }
        this.lastReactiveFormObject = formObjectString;
        this.formGroup$.next(this.fb.group(formObject));
        this.result = this.formGroup$.value.value;
        this.changes$.next(this.result);
    }

    element(id: string): IFormElementDefinition {
        return this.elements.find(x => x.id === id);
    }

    evalAllValues(): void {
        this.elements.forEach(x => x.evalValues());
    }

    getReactiveFormObject(): { [key: string]: any } {
        return this.elements.reduce((prev, cur) => {
            return {
                ...cur.getReactiveFormObject(this.result),
                ...prev,
            };
        }, {});
    }

}

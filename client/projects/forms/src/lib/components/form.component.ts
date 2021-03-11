import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Subject, BehaviorSubject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { IButtonFunction } from '../form/button-function';
import { FormDefinition, IFormModel } from '../form/form-definition';

@Component({
    selector: 'akrons-forms-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.less'],
})
export class FormComponent implements OnInit, OnDestroy {

    @Input() formModel$: BehaviorSubject<IFormModel>;
    @Input() changes$: Subject<object>;
    @Input() functions: IButtonFunction[];

    destroy$: Subject<void> = new Subject();

    myForm: FormGroup;
    form: FormDefinition;

    constructor(
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        if (!this.changes$) {
            this.changes$ = new Subject();
        }
    }

    ngOnInit(): void {
        this.formModel$
            .pipe(
                startWith(this.formModel$.getValue()),
                switchMap(formModel => {
                    if (this.form) {
                        this.form.destroy();
                    }
                    this.form = new FormDefinition(formModel, this.fb, this.changes$);
                    return this.form.formGroup$;
                }),
                takeUntil(this.destroy$),
            )
            .subscribe({
                next: formGroup => {
                    this.myForm = formGroup;
                    this.changeDetectorRef.markForCheck();
                    // this.changeDetectorRef.detectChanges();
                }
            });
        this.changes$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: x => console.log('form changes,', x),
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    callFunction(name: string): void {
        const selectedFunction = this.functions.find(x => x.name === name);
        if (!selectedFunction) {
            console.error(`The called Function ${name} is not registered! (Registered functions: [${this.functions.map(x => x.name).join(', ')}])`);
            return;
        }
        selectedFunction.action(this.formModel$, this.form);
    }

}

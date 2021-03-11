import { IButtonFunction, IFormModel } from '@akrons/forms';
import { cms } from '@akrons/types';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BackendElementManagerService } from '../../../../services/backend-element-manager.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-backend-page-component-editor',
  templateUrl: './pageComponentEdit.component.html',
  styleUrls: ['./pageComponentEdit.component.scss']
})
export class PageComponentEditComponent implements OnInit, OnDestroy {
  @Input()
  elements: cms.IPayload[];
  @Input()
  index: number;

  editorFormModel$: BehaviorSubject<IFormModel> = new BehaviorSubject(undefined);
  editorChanges$: Subject<object> = new Subject();
  editorFunctions: IButtonFunction[];

  destroy$: Subject<void> = new Subject();

  element: cms.IPayload;
  edit: boolean;

  constructor(
    private backendElementManagerService: BackendElementManagerService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.element = this.elements[this.index];
    const elementDefinition = this.backendElementManagerService.getElement(this.element.type);
    this.editorFormModel$.next(elementDefinition.editorForm(this.element.data));
    this.editorFunctions = elementDefinition.functions;
    this.editorChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (formValue) => {
          this.element.data = formValue;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleedit(): void {
    this.edit = !this.edit;
    const elementDefinition = this.backendElementManagerService.getElement(this.element.type);
    this.editorFormModel$.next(elementDefinition.editorForm(this.element.data));
  }

  moveup(): void {
    const tmp: cms.IPayload = this.elements[this.index];
    this.elements[this.index] = this.elements[this.index - 1];
    this.elements[this.index - 1] = tmp;
  }

  movedown(): void {
    const tmp: cms.IPayload = this.elements[this.index];
    this.elements[this.index] = this.elements[this.index + 1];
    this.elements[this.index + 1] = tmp;
  }

  delete(): void {
    this.elements.splice(this.index, 1);
  }

}

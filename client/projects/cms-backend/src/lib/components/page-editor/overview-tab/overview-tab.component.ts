import { IButtonFunction, IFormModel } from '@akrons/forms';
import { cms } from '@akrons/types';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendPageOptionsService } from '../../../services/backend-page-options.service';

@Component({
  selector: 'app-overview-tab',
  templateUrl: './overview-tab.component.html',
  styleUrls: ['./overview-tab.component.scss']
})
export class OverviewTabComponent implements OnInit, OnDestroy {
  @Input() selectedPage: cms.IPage;

  destroy$: Subject<void> = new Subject();
  formModel$: BehaviorSubject<IFormModel> = new BehaviorSubject({elements: []});
  changes$: Subject<object> = new Subject();
  functions: IButtonFunction[] = [];

  constructor(
    private backendPageOptionsService: BackendPageOptionsService,
  ) { }

  ngOnInit(): void {
    this.formModel$.next({
      elements: this.backendPageOptionsService.getElements().map(pageOption => {
        let defaultValue;
        if (pageOption.key === 'id') {
          defaultValue = this.selectedPage.id;
        } else if (pageOption.key === 'title') {
          defaultValue = this.selectedPage.title;
        } else {
          defaultValue = this.selectedPage.options.find(x => x.key === pageOption.key)?.value || undefined;
        }
        return { ...pageOption.form, default: { type: 'static', value: defaultValue } };
      }),
    });
    this.changes$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          Object.keys(value).forEach(key => {
            if (!this.selectedPage.options) {
              this.selectedPage.options = [];
            }
            const pageOption = this.backendPageOptionsService.getElement(key);
            if (pageOption.key === 'id') {
              this.selectedPage.id = value[key];
            } else if (pageOption.key === 'title') {
              this.selectedPage.title = value[key];
            } else {
              const optionIndex = this.selectedPage.options.findIndex(x => x.key === key);
              if (optionIndex >= 0) {
                this.selectedPage.options[optionIndex].value = value[key];
              } else {
                this.selectedPage.options.push({
                  key,
                  value: value[key],
                });
              }
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

interface ICall<T, D, R> {
    component: ComponentType<T>;
    config?: MatDialogConfig<D>;
    dialogRef?: (dialogRef: MatDialogRef<T, R>) => void;
}

export const DialogStaticService = new Subject<ICall<any, any, any>>();

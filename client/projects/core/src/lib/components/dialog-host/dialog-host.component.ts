import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogStaticService } from '../../dialog-static-service';

@Component({
  selector: 'akrons-core-dialog-host',
  templateUrl: './dialog-host.component.html',
  styleUrls: ['./dialog-host.component.css']
})
export class DialogHostComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    DialogStaticService
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: call => {
          const dialogRef = this.dialog.open(call.component, call.config);
          if (call.dialogRef) {
            call.dialogRef(dialogRef);
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

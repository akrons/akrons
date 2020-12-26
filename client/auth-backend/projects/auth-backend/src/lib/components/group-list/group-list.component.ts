import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { IGroup, IInsertGroup } from '@akrons/types/dist/auth';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { GroupsService } from '../../services/groups.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditComponent } from '../group-edit/group-edit.component';
import { ConfirmDialogComponent, IConfirmDialogData } from '@akrons/core';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'akrons-auth-backend-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupListComponent implements OnInit, OnDestroy {

  dataSource$: Observable<MatTableDataSource<IGroup>>;
  expanded: any;
  destroy$ = new Subject<void>();
  columnsToDisplay = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private groupsService: GroupsService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.dataSource$ = this.groupsService.getList$().pipe(
      map(groups => {
        groups.sort((a, b) => a.name.localeCompare(b.name));
        const dataSource = new MatTableDataSource(groups);
        dataSource.sort = this.sort;
        return dataSource;
      }),
      takeUntil(this.destroy$),
    );
    this.observeBreakpoints();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  observeBreakpoints() {
    const columns = {
      id: 'id',
      name: 'name',
      permissions: 'permissions'
    };

    const breakpoints = {
      small: "(max-width: 600px)",
      medium: "(min-width: 601px) and (max-width: 1000px)",
      large: "(min-width: 1001px)"
    }
    this.breakpointObserver
      .observe([
        breakpoints.small,
        breakpoints.medium,
        breakpoints.large
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.breakpoints[breakpoints.small]) {
          this.columnsToDisplay = [columns.name];
        } else if (result.breakpoints[breakpoints.medium]) {
          this.columnsToDisplay = [columns.name, columns.permissions];
        } else {
          this.columnsToDisplay = [columns.id, columns.name, columns.permissions];
        }
      });
  }

  create(): void {
    this.edit({
      name: 'Neue Gruppe',
      permissions: []
    });
  }

  edit(x: IInsertGroup): void {
    this.dialog.open(GroupEditComponent, {
      data: x,
      height: '500px',
      width: '600px',
    });
  }

  delete(x: IGroup): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: <IConfirmDialogData>{
        title: `Gruppe löschen`,
        message: ` Sind sie sicher dass sie die Gruppe '${x.name}', löschen wollen?`,
        actionName: 'Löschen',
      },
      height: '500px',
      width: '600px',
    });
    dialogRef.afterClosed()
      .subscribe({
        next: async (result: boolean) => {
          if (result) {
            await this.groupsService.delete(x.id);
          }
        },
      });
  }

  permissionsString(permissions: string[]): string {
    const maxLength = 40;
    const fullString = permissions.join(', ');
    return (fullString.length > maxLength) ? fullString.substr(0, maxLength) + '...' : fullString;
  }
}

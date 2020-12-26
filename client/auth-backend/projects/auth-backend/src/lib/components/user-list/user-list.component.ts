import { ConfirmDialogComponent, IConfirmDialogData } from '@akrons/core';
import { IInsertUser, IUser } from '@akrons/types/dist/auth';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserResetPasswordComponent } from '../user-reset-password/user-reset-password.component';

@Component({
  selector: 'akrons-auth-backend-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserListComponent implements OnInit, OnDestroy {

  dataSource$: Observable<MatTableDataSource<IUser>>;
  expanded: IUser;
  expandedUserGroups: Subject<string[]> = new Subject();
  destroy$ = new Subject<void>();
  columnsToDisplay = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private groupService: GroupsService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.dataSource$ = this.usersService.getList$().pipe(
      map(groups => {
        groups.sort((a, b) => a.login.localeCompare(b.login));
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
      login: 'login',
      groups: 'groups',
      passwordChangeRequired: 'passwordChangeRequired'
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
          this.columnsToDisplay = [columns.login];
        } else if (result.breakpoints[breakpoints.medium]) {
          this.columnsToDisplay = [columns.login, columns.groups];
        } else {
          this.columnsToDisplay = [columns.login, columns.id, columns.groups, columns.passwordChangeRequired];
        }
      });
  }

  create(): void {
    this.edit({
      login: 'new_user',
      groups: [],
    });
  }

  edit(x: IInsertUser): void {
    this.dialog.open(UserEditComponent, {
      data: x,
      height: '500px',
      width: '600px',
    });
  }

  changePassword(x: IUser): void {
    this.dialog.open(UserResetPasswordComponent, {
      data: x,
      height: '500px',
      width: '600px',
    });
  }

  delete(x: IUser): void {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: <IConfirmDialogData>{
        title: `Gruppe löschen`,
        message: ` Sind sie sicher dass sie den Benutzer '${x.login}', löschen wollen?`,
        actionName: 'Löschen',
      },
      height: '500px',
      width: '600px',
    });
    dialogRef.afterClosed()
      .subscribe({
        next: async (result: boolean) => {
          if (result) {
            await this.usersService.delete(x.id);
          }
        },
      });
  }

  async getGroupNames(groupIds: string[]): Promise<string[]> {
    return Promise.all(
      groupIds.map(groupId => this.groupService.getId(groupId).then(x => x.name))
    );
  }

  async expandRow(row: IUser): Promise<void> {
    this.expanded = this.expanded === row ? null : row;
    this.expandedUserGroups.next([]);
    this.expandedUserGroups.next(await this.getGroupNames(row.groups));
  }
}

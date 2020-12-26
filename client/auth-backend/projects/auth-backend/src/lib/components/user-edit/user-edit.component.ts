import { IGroup, IUser } from '@akrons/types/dist/auth';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'akrons-auth-backend-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  loginName = new FormControl(this.selectedUser.login, [Validators.required])
  passwordChangeRequired = new FormControl(this.selectedUser.passwordChangeRequired)

  showValidationErrors = false;
  processing = false;

  groupControls: { formControl: FormControl, id: string, name: string }[] = [];

  passwordFeedback: undefined | { id: string, password: string };


  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public selectedUser: IUser,
    private userService: UsersService,
    private groupsService: GroupsService,
  ) { }

  ngOnInit(): void {
    this.groupsService.getList$()
      .pipe(
        map(groups => groups.map(group => ({
          formControl: new FormControl(this.selectedUser.groups.indexOf(group.id) !== -1),
          id: group.id,
          name: group.name,
        }))),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: x => {
          this.groupControls = x;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async save(): Promise<void> {
    this.processing = true;
    try {
      if (!this.loginName.valid) {
        this.showValidationErrors = true;
      }
      if (this.selectedUser.id) {
        await this.userService.update(this.selectedUser.id, {
          login: this.loginName.value,
          passwordChangeRequired: this.passwordChangeRequired.value,
          groups: this.groupControls.filter(x => x.formControl.value).map(x => x.id)
        });
        this.dialogRef.close();
      } else {
        this.passwordFeedback = await this.userService.insert({
          login: this.loginName.value,
          groups: this.groupControls.filter(x => x.formControl.value).map(x => x.id)
        });
      }
    } finally {
      this.processing = false;
    }
  }

  discardChanges() {
    this.dialogRef.close();
  }


}

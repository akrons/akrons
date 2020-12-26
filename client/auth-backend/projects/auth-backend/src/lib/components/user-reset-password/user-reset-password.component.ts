import { IUser } from '@akrons/types/dist/auth';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'akrons-auth-backend-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent implements OnInit {
  processing = false;
  hideNewPassword: boolean = true;
  newPasswordControl = new FormControl('', [
    Validators.minLength(8),
    Validators.pattern('^.*[A-Z].*$'),
    Validators.pattern('^.*[a-z].*$'),
    Validators.pattern('^.*[!"§%&\\\\\\/()=\\?`´^\\*\\+~\'#\\.:,;<>|²³\\{\\[\\]\\}ß@€µ].*$'),
  ]);

  hideNewPasswordRetry: boolean = true;
  newPasswordRetryControl = new FormControl('', [
    Validators.required,
    (control) => {
      if (control.value !== this.newPasswordControl.value) {
        return new Error('password-missmatch');
      }
      return null;
    }
  ]);
  showValidationErrors: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public selectedUser: IUser,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
  }



  async save(): Promise<void> {
    this.processing = true;
    try {
      if (
        !this.newPasswordControl.valid ||
        !this.newPasswordRetryControl.valid
      ) {
        this.showValidationErrors = true;
      }
      this.usersService.setPassword(this.selectedUser.id, this.newPasswordControl.value);
      this.dialogRef.close();
    } finally {
      this.processing = false;
    }
  }

  discardChanges() {
    this.dialogRef.close();
  }

}

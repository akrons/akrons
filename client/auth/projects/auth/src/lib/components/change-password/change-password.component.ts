import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_CHANGE_PASSWORD_REDIRECT_PROVIDER } from '../../injectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'akrons-auth-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  processing: boolean;
  loginControl = new FormControl('', [Validators.required]);

  hideOldPassword: boolean = true;
  oldPasswordControl = new FormControl('', [Validators.required]);

  hideNewPassword: boolean = true;
  newPasswordControl = new FormControl('', [
    Validators.minLength(8),
    Validators.pattern(/[A-Z]/gm),
    Validators.pattern(/[a-z]/gm),
    Validators.pattern(/[!"§%&\/()=?`´^*+~'#.:,;<>|²³\{\[\]\}\\ß@€µ]/gm),
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
    private location: Location,
    private authService: AuthService,
    private router: Router,
    @Inject(AUTH_CHANGE_PASSWORD_REDIRECT_PROVIDER)
    private changePasswordRedirectRoute: string[],
  ) { }

  ngOnInit(): void {
  }

  async changePassword(): Promise<void> {
    try {
      if (
        !this.loginControl.valid
        || !this.oldPasswordControl.valid
        || !this.newPasswordControl.valid
        || !this.newPasswordRetryControl.valid
      ) {
        this.showValidationErrors = true;
        return;
      }
      this.processing = true;
      await this.authService.changePassword(
        this.loginControl.value,
        this.oldPasswordControl.value,
        this.newPasswordControl.value
      )
      await this.router.navigate(this.changePasswordRedirectRoute);
    } finally {
      this.processing = false;
    }
  }

  abort(): void {
    this.location.back();
  }

}

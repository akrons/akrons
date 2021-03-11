import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    Validators.pattern('^.*[A-Z].*$'),
    Validators.pattern('^.*[a-z].*$'),
    Validators.pattern('^.*[!"§%&\\\\\\/()=\\?`´^\\*\\+~\'#\\.:,;<>|²³\\{\\[\\]\\}ß@€µ].*$'),
  ]);

  hideNewPasswordRetry: boolean = true;
  newPasswordRetryControl = new FormControl('', [
    Validators.required,
    (control) => {
      if (control.value !== this.newPasswordControl.value) {
        return { passwordMatch: { valid: false } };
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
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const login = this.activatedRoute.snapshot.queryParams.login;
    if (login) {
      this.loginControl.setValue(login);
    }
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
      await this.router.navigate(this.changePasswordRedirectRoute, { queryParams: { login: this.loginControl.value } });
    } finally {
      this.processing = false;
    }
  }

  abort(): void {
    this.location.back();
  }

}

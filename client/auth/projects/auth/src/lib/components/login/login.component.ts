import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_CHANGE_PASSWORD_ROUTE_PROVIDER, AUTH_LOGIN_REDIRECT_PROVIDER } from '../../injectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'akrons-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  processing: boolean;
  hide: boolean = true;
  loginControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  showValidationErrors: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(AUTH_LOGIN_REDIRECT_PROVIDER)
    private loginRedirectRoute: string[],
    @Inject(AUTH_CHANGE_PASSWORD_ROUTE_PROVIDER)
    private changePasswordRoute: string[]
  ) { }

  ngOnInit(): void {

  }

  async login(): Promise<void> {
    if (!this.loginControl.valid || !this.passwordControl.valid) {
      this.showValidationErrors = true;
      return;
    }
    this.processing = true;
    try {
      await this.authService.login(
        this.loginControl.value,
        this.passwordControl.value,
      )
    } catch (err) {
      this.processing = false;
      if (err.error?.error === 'passwordChangeRequired') {
        await this.router.navigate(this.changePasswordRoute);
        return;
      }
      throw err;
    }
    this.processing = false;
    await this.router.navigate(this.loginRedirectRoute);
  }

}

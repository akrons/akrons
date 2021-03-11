import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  loginInvalid: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(AUTH_LOGIN_REDIRECT_PROVIDER)
    private loginRedirectRoute: string[],
    @Inject(AUTH_CHANGE_PASSWORD_ROUTE_PROVIDER)
    private changePasswordRoute: string[],
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const login = this.activatedRoute.snapshot.queryParams.login;
    if (login) {
      this.loginControl.setValue(login);
    }
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
      if (err.status === 401) {
        this.loginInvalid = true;
        return;
      }
      if (err.status === 403) {
        await this.router.navigate(this.changePasswordRoute, { queryParams: { login: this.loginControl.value } });
        return;
      }
      throw err;
    }
    this.processing = false;
    await this.router.navigate(this.loginRedirectRoute);
  }

}

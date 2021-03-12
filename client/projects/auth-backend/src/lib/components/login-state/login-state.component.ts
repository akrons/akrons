import { Component, Inject, OnInit } from '@angular/core';
import { AuthService, injectors } from '@akrons/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'akrons-auth-backend-login-state',
  templateUrl: './login-state.component.html',
  styleUrls: ['./login-state.component.css']
})
export class LoginStateComponent implements OnInit {

  loginName: string;

  constructor(
    @Inject(injectors.AUTH_LOGIN_ROUTE_PROVIDER)
    private authLoginRoute: string,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginName = this.authService.userName();
  }


  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate([this.authLoginRoute]);
  }
}

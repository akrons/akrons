import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpService, IHttpService, IHttpOptions } from '@akrons/core';
import { AUTH_ENDPOINT_PROVIDER } from '../injectors';
import { differenceInMilliseconds, isPast } from 'date-fns';
import { interval, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { auth } from '@akrons/types';

const TOKEN_SESSION_STORAGE_KEY = 'AKRONS_SESSION_TOKEN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token?: string;
  private stopTokenRefresh$: Subject<void> = new Subject();

  constructor(
    private httpService: HttpService,
    @Inject(AUTH_ENDPOINT_PROVIDER)
    private authEndpoint: string,
  ) { }

  init() {
    this.httpService.addHeaderMiddleWare(x => this.httpMiddleware(x))
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  hasPermission(permission: string): boolean {
    if (!this.token) {
      return false;
    }
    const { token } = auth.decodeToken(this.token);
    return auth.hasPermission(permission, token.permissions);
  }

  userName(): string | undefined {
    if (!this.token) {
      return undefined;
    }
    const { token } = auth.decodeToken(this.token);
    return token.userName;
  }

  async login(username: string, password: string): Promise<void> {
    const { token } = await this.endpoint.post<ITokenResponse>('login', {
      username,
      password
    }).toPromise();
    this.token = token;
    this.refreshTokenCheck();
  }

  async logout(): Promise<void> {
    this.stopTokenRefresh$.next();
    await this.endpoint.post('logout');
    this.token = undefined;
  }

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    await this.endpoint.patch('/me/change-password', {
      login: username,
      old: oldPassword,
      new: newPassword
    }).toPromise()
  }

  private get token(): string | undefined {
    if (!this._token) {
      let tokenString = sessionStorage.getItem(TOKEN_SESSION_STORAGE_KEY);
      if (!tokenString) {
        return undefined;
      }
      const { token } = auth.decodeToken(tokenString);
      if (isPast(token.renewableUntil)) {
        sessionStorage.removeItem(TOKEN_SESSION_STORAGE_KEY);
        return undefined;
      }
      this._token = tokenString;
      this.refreshTokenCheck();
    }
    return this._token;
  }

  private set token(value: string) {
    this._token = value;
    if (!value) {
      sessionStorage.removeItem(TOKEN_SESSION_STORAGE_KEY);
    } else {
      sessionStorage.setItem(TOKEN_SESSION_STORAGE_KEY, value);
    }
  }

  private getTokenExpires(): Date {
    const { token } = auth.decodeToken(this.token);
    return token.expires;
  }

  private refreshTokenCheck(): void {
    this.stopTokenRefresh$.next();
    const millisecondsBeforeExpires = 30000;
    const checkEvery = 10000;
    interval(checkEvery)
      .pipe(
        filter(() => {
          const diff = Math.abs(differenceInMilliseconds(this.getTokenExpires(), new Date()));
          return diff < millisecondsBeforeExpires;
        }),
        switchMap(() => {
          return this.endpoint.post<ITokenResponse>('/refresh-token')
        }),
        takeUntil(this.stopTokenRefresh$),
      )
      .subscribe({
        next: ({ token: newToken }) => {
          this.token = newToken
        },
      })
  }

  private httpMiddleware(options: IHttpOptions): IHttpOptions {
    if (this.token) {
      options.headers = options.headers.set('authorization', this.token);
    }
    return options;
  }

  private get endpoint(): IHttpService {
    return this.httpService.endpoint(this.authEndpoint);
  }

}

interface ITokenResponse {
  token: string;
}

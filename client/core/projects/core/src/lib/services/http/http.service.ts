import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { joinPath } from '../../join-path';
import { CORE_PRODUCTION_INJECTOR } from '../../injectors';

type IHeaderMiddleware = (options: IHttpOptions) => IHttpOptions;

/**
 * An proxy for the HttpClient, which adds the authorization headers.
 *
 * @export
 * @class HttpService
 */
@Injectable(/**{
  providedIn: 'root'
}*/)
export class HttpService implements IHttpService {

  private headerMiddlewareS: IHeaderMiddleware[] = [];

  constructor(
    private httpClient: HttpClient,
    @Inject(CORE_PRODUCTION_INJECTOR)
    production: boolean,
  ) {
    if (!production) {
      this.publish();
    }
  }

  public publish(): void {
    if (!window['api']) {
      window['api'] = {};
    }
    window['api'].http = this;
  }

  public get<T>(route: string, options?: IHttpOptions): Observable<T> {
    return this.httpClient.get<T>(route, this.addHeaders(options));
  }
  public post<T>(route: string, body?: any, options?: IHttpOptions): Observable<T> {
    return this.httpClient.post<T>(route, body || {}, this.addHeaders(options));
  }
  public put<T>(route: string, body?: any, options?: IHttpOptions): Observable<T> {
    return this.httpClient.put<T>(route, body || {}, this.addHeaders(options));
  }
  public patch<T>(route: string, body?: any, options?: IHttpOptions): Observable<T> {
    return this.httpClient.patch<T>(route, body || {}, this.addHeaders(options));
  }
  public delete<T>(route: string, options?: IHttpOptions): Observable<T> {
    return this.httpClient.delete<T>(route, this.addHeaders(options));
  }

  public endpoint(endpoint: string): IHttpService {
    return {
      get: <T>(route?: string, options?: IHttpOptions): Observable<T> => this.get(joinPath(endpoint, route), options),
      post: <T>(route?: string, body?: any, options?: IHttpOptions): Observable<T> => this.post(joinPath(endpoint, route), body, options),
      put: <T>(route?: string, body?: any, options?: IHttpOptions): Observable<T> => this.put(joinPath(endpoint, route), body, options),
      patch: <T>(route?: string, body?: any, options?: IHttpOptions): Observable<T> => this.patch(joinPath(endpoint, route), body, options),
      delete: <T>(route?: string, options?: IHttpOptions): Observable<T> => this.delete(joinPath(endpoint, route), options),
    };
  }

  public addHeaderMiddleWare(
    headerMiddleWare: IHeaderMiddleware,
  ): void {
    this.headerMiddlewareS.push(headerMiddleWare);
  }

  addHeaders(options?: IHttpOptions): IHttpOptions {
    return this.headerMiddlewareS.reduce<IHttpOptions>(
      (currentOptions, middleware) => middleware(currentOptions),
      options || { headers: new HttpHeaders() }
    );
  }

}

export interface IHttpService {
  get<T>(route?: string, options?: IHttpOptions): Observable<T>;
  post<T>(route?: string, body?: any, options?: IHttpOptions): Observable<T>;
  put<T>(route?: string, body?: any, options?: IHttpOptions): Observable<T>;
  patch<T>(route?: string, body?: any, options?: IHttpOptions): Observable<T>;
  delete<T>(route?: string, options?: IHttpOptions): Observable<T>;
}

interface IHttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  responseType?: 'json';
}

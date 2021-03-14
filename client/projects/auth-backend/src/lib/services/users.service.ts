import { Inject, Injectable } from '@angular/core';
import { HttpService, IHttpService, joinPath } from '@akrons/core';
import { AUTH_BACKEND_ENDPOINT_INJECTOR } from '../injectors';
import { IUser, IInsertUser, IUpdateUser } from '@akrons/common-auth';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private list$: Subject<IUser[]> = new Subject();

  constructor(
    private httpService: HttpService,
    @Inject(AUTH_BACKEND_ENDPOINT_INJECTOR)
    private authBackendEndpoint: string,
  ) { }

  getList$(): Observable<IUser[]> {
    this.endpoint.get<IUser[]>().toPromise().then(x => this.list$.next(x));
    return this.list$;
  }

  getId(id: string): Promise<IUser> {
    return this.endpoint.get<IUser>(id).toPromise();
  }

  async insert(newElement: IInsertUser): Promise<{ id: string, password: string }> {
    const result = await this.endpoint.post<{ id: string, password: string }>('', newElement).toPromise();
    this.getList$();
    return result;
  }

  async update(id: string, updated: IUpdateUser): Promise<void> {
    await this.endpoint.patch(id, updated).toPromise();
    this.getList$();
  }

  async delete(id: string): Promise<void> {
    await this.endpoint.delete(id).toPromise();
    this.getList$();
  }

  async setPassword(id: string, password: string): Promise<void> {
    await this.endpoint.post(joinPath('set-password', id), { password }).toPromise();
  }

  private get endpoint(): IHttpService {
    return this.httpService.endpoint(joinPath(this.authBackendEndpoint, '/users'));
  }
}

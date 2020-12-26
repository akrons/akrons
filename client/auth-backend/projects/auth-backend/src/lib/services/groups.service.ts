import { Inject, Injectable } from '@angular/core';
import { HttpService, IHttpService, joinPath } from '@akrons/core';
import { AUTH_BACKEND_ENDPOINT_INJECTOR } from '../injectors';
import { Observable, Subject } from 'rxjs';
import { IGroup, IInsertGroup } from '@akrons/types/dist/auth'
@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private list$: Subject<IGroup[]> = new Subject();

  constructor(
    private httpService: HttpService,
    @Inject(AUTH_BACKEND_ENDPOINT_INJECTOR)
    private authBackendEndpoint: string,
  ) { }

  getList$(): Observable<IGroup[]> {
    this.endpoint.get<IGroup[]>().toPromise().then(x => this.list$.next(x));
    return this.list$;
  }

  getId(id: string): Promise<IGroup> {
    return this.endpoint.get<IGroup>(id).toPromise();
  }

  async insert(newElement: IInsertGroup): Promise<void> {
    await this.endpoint.post('', newElement).toPromise();
    this.getList$();
  }

  async update(id: string, updated: IInsertGroup): Promise<void> {
    await this.endpoint.patch(id, updated).toPromise();
    this.getList$();
  }
  
  async delete(id): Promise<void> {
    await this.endpoint.delete(id).toPromise();
    this.getList$();
  }

  private get endpoint(): IHttpService {
    return this.httpService.endpoint(joinPath(this.authBackendEndpoint, '/groups'));
  }
}

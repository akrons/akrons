import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, IHttpService } from '@akrons/core';
import { CMS_ENDPOINT_PROVIDER } from '../injectors';
import { cms } from '@akrons/types';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private httpClient: HttpService,
    @Inject(CMS_ENDPOINT_PROVIDER)
    private endpoint: string,
  ) { }

  loadPage(route: string): Observable<cms.IPage> {
    return this.getEndpoint().get<cms.IPage>(route);
  }

  private getEndpoint(): IHttpService {
    return this.httpClient.endpoint(this.endpoint);
  }
}

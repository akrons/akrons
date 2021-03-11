import { Inject, Injectable } from '@angular/core';
import { HttpService, IHttpService } from '@akrons/core';
import { CMS_BACKEND_ENDPOINT } from '../injectors';
import { cms } from '@akrons/types';
import { Observable, Subject } from 'rxjs';
import { BackendElementManagerService } from './backend-element-manager.service';

@Injectable({
  providedIn: 'root',
})
export class PageBackendService {
  private allPagesSubject$ = new Subject<cms.IPage[]>();

  constructor(
    @Inject(CMS_BACKEND_ENDPOINT)
    private endpoint: string,
    private http: HttpService,
    private backendElementManagerService: BackendElementManagerService,
  ) { }

  async savePage(id: string, page: cms.IPage): Promise<void | any> {
    page.elements.forEach(element => {
      const elementDefinition = this.backendElementManagerService.getElement(element.type);
      if (elementDefinition.preSave) {
        elementDefinition.preSave(element, page);
      }
    });
    await this.getEndpoint().post(id, page).toPromise();
    this.getAll$();
  }

  async deletePage(page: cms.IPage): Promise<void | any> {
    await this.getEndpoint().delete(page.id).toPromise();
    this.getAll$();
  }

  getAll$(): Observable<cms.IPage[]> {
    this.getEndpoint().get<cms.IPage[]>().toPromise().then(x => this.allPagesSubject$.next(x));
    return this.allPagesSubject$;
  }

  private getEndpoint(): IHttpService {
    return this.http.endpoint(this.endpoint);
  }
}

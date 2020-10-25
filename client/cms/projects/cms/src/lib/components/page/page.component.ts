import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TitleService } from '@akrons/core';
import { cms } from '@akrons/types';

@Component({
  selector: 'akrons-cms-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  elements: Observable<cms.IPayload[]>;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private titleService: TitleService
  ) { }

  ngOnInit(): void {
    const activatedRouteSnapshot = this.route.snapshot;
    if (activatedRouteSnapshot.data['template']) {
      const templatePage: cms.IPage = activatedRouteSnapshot.data['template'];
      this.elements = of(templatePage.elements);
      this.titleService.setTitle(templatePage.title);
      return;
    }
    const route = activatedRouteSnapshot.url.map(x => x.toString()).join('/');
    const page = this.contentService.loadPage(route);
    this.elements = page.pipe(map(x => x.elements));
    page.pipe(take(1)).subscribe({next: x => {
      this.titleService.setTitle(x.title);
    }});
  }

}

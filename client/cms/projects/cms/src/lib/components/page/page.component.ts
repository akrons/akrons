import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, share, startWith, take, takeUntil } from 'rxjs/operators';
import { TitleService } from '@akrons/core';
import { cms } from '@akrons/types';
import { Location } from '@angular/common';

@Component({
  selector: 'akrons-cms-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit, OnDestroy {

  @Input()
  changeTitle?: boolean;

  @Input()
  loadRoute?: string;

  destroy$: Subject<void> = new Subject();
  elements: Observable<cms.IPayload[]>;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private titleService: TitleService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit(): void {
    if (this.loadRoute) {
      this.loadPageFromRoute(this.loadRoute);
      return;
    }
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd),
        takeUntil(this.destroy$),
        startWith(0)
      )
      .subscribe({
        next: () => this.routeChange()
      });
  }

  private routeChange() {
    if (this.route.snapshot.data['template']) {
      const templatePage: cms.IPage = this.route.snapshot.data['template'];
      this.elements = of(templatePage.elements);
      this.setTitle(templatePage.title);
      return;
    }
    const url = this.location.path();
    this.loadPageFromRoute(url);
  }

  private loadPageFromRoute(route: string) {
    const page = this.contentService.loadPage(route).pipe(share(), takeUntil(this.destroy$));
    this.elements = page.pipe(map(x => x.elements));
    page.pipe(take(1)).subscribe({
      next: x => {
        this.setTitle(x.title);
      }
    });
  }

  setTitle(title: string): void {
    if (this.changeTitle === undefined || this.changeTitle) {
      this.titleService.setTitle(title);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

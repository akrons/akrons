import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, share, take, takeUntil } from 'rxjs/operators';
import { TitleService } from '@akrons/core';
import { cms } from '@akrons/types';

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
  ) { }

  ngOnInit(): void {
    if (this.loadRoute) {
      this.loadPageFromRoute(this.loadRoute);
      return;
    }
    combineLatest([
      this.route.url,
      this.route.data,
    ]).pipe(
      debounceTime(10),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([url, data]) => {
        if (data['template']) {
          const templatePage: cms.IPage = data['template'];
          this.elements = of(templatePage.elements);
          this.setTitle(templatePage.title);
          return;
        }
        const route = url.map(x => x.toString()).join('/');
        this.loadPageFromRoute(route);
      }
    });
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
    if (this.changeTitle) {
      this.titleService.setTitle(title);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

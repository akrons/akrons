import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { BACKEND_TITLE_INJECTOR } from '../../injectors';
import { BackendHeaderOptionsService } from '../../services/backend-header-options.service';
import { BackendOptionsListService, IBackenOptionsListOption } from '../../services/backend-options-list.service';
import { injectors } from '@akrons/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'akrons-backend-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements OnInit, OnDestroy {

  @ViewChild('headerOptionsPlaceholder', { read: ViewContainerRef, static: true }) headerOptionsPlaceholder: ViewContainerRef;

  destroy$ = new Subject<void>();

  routes: IBackenOptionsListOption[];
  isMobile

  constructor(
    @Inject(BACKEND_TITLE_INJECTOR)
    public backendTitleInjector: string,
    @Inject(injectors.CORE_MOBILE_BREAKPOINT_PX_INJECTOR)
    private coreMobileBreakpointPxInjector: number,
    private breakpointObserver: BreakpointObserver,
    private componentFactoryResolver: ComponentFactoryResolver,
    private backendOptionsListService: BackendOptionsListService,
    private backendHeaderOptionsService: BackendHeaderOptionsService,
  ) { }

  ngOnInit(): void {
    this.headerOptionsPlaceholder.clear();
    this.backendHeaderOptionsService.getList().forEach(componentRef => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentRef);
      const componentInstance: ComponentRef<any> = this.headerOptionsPlaceholder.createComponent(componentFactory);
    });
    this.routes = this.backendOptionsListService.getOptions();
    this.breakpointObserver
      .observe([`(max-width: ${this.coreMobileBreakpointPxInjector}px)`])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

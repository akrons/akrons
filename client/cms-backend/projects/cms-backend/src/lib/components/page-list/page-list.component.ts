import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, fromEvent, Subject } from 'rxjs';
import { tap, map, startWith, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { PageEditorComponent } from '../page-editor/page-editor.component';
import { IConfirmDialogData, ConfirmDialogComponent } from '@akrons/core';
import { cms } from '@akrons/types';
import { PageBackendService } from '../../services/page-backend.service';

@Component({
    selector: 'akrons-cms-backend-page',
    templateUrl: './page-list.component.html',
    styleUrls: ['./page-list.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class PageListComponent implements OnInit, OnDestroy {

    @ViewChild('addType')
    addType: ElementRef;

    dataSource$: Observable<MatTableDataSource<cms.IPage>>;
    expandedSermon: cms.IPage;

    columnsToDisplay = [];
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    destroy$ = new Subject<void>();

    constructor(
        private contentService: PageBackendService,
        public dialog: MatDialog,
        public cd: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        this.dataSource$ = this.contentService.getAll$().pipe(map(x => {
            const dataSource = new MatTableDataSource(x);
            dataSource.sort = this.sort;
            return dataSource;
        }));
        fromEvent(window, 'resize')
            .pipe(
                startWith(null),
                takeUntil(this.destroy$),
            )
            .subscribe({
                next: () => {
                    if (window.innerWidth < 700) {
                        this.columnsToDisplay = ['title'];
                        this.cd.markForCheck();
                    } else if (window.innerWidth < 1000) {
                        this.columnsToDisplay = ['title', 'description'];
                        this.cd.markForCheck();
                    } else {
                        this.columnsToDisplay = ['title', 'id', 'description'];
                        this.cd.markForCheck();
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    editPage(source: cms.IPage): void {
        let dialogRef = this.dialog.open(PageEditorComponent, {
            height: '100%',
            width: '100%',
            closeOnNavigation: false,
            disableClose: true,
            data: source,
        });
    }

    async deletePage(page: cms.IPage): Promise<void> {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: <IConfirmDialogData>{
                title: `Seite löschen`,
                message: ` Sind sie sicher dass sie die Seite '${page.title}' löschen wollen?`,
                actionName: 'Löschen'
            },
            height: '500px',
            width: '600px',
        });
        dialogRef.afterClosed()
            .subscribe({
                next: async (result: boolean) => {
                    if (result) {
                        await this.contentService.deletePage(page);
                    }
                },
            });
    }

    async addPage(): Promise<void> {
        const newPage: cms.IPage = {
            id: 'neue_seite',
            elements: [],
            title: 'Neue Seite',
            options: [],
        };
        this.editPage(newPage);
    }

}

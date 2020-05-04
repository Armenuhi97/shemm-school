import { Component, Inject } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';
import { ServerResponse, DataCount, Subsection } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AddSubsectionModal } from 'src/app/com/annaniks/shemm-school/modals/add-subsection/add-subsection.modal';

@Component({
    selector: 'subsection-view',
    templateUrl: 'subsection.view.html',
    styleUrls: ['subsection.view.scss']
})
export class SubsectionView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Ենթաբաժին';

    public subsections: Subsection[] = []
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription
    public titles = [
        { title: 'Կոդ' }, { title: 'Անվանում' },
        { title: 'Գնորդի հաշիվ' }, { title: 'Ստացված կանխավճարի հաշիվ' }, { title: 'ԱԱՀ-ի հաշիվ' }
    ]
    constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this._title.setTitle(this._modalTitle)
    }

    ngOnInit() {
        this._checkParams()
    }
    private _combineObservable(limit: number, offset: number): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getSubsectionCount(),
            this._getSubsections(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
    }
    private _checkParams(): void {
        this._resetProperties()
        this._activatedRoute.queryParams.subscribe((queryparams) => {
            if (queryparams && queryparams.page) {
                this._page = +queryparams.page;
            }
            this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
        })

    }
    private _getSubsectionCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.subsectionMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }

    public addSubsection(isNew?: boolean, id?: number): void {
        this.openModal(isNew, id)
    }
    public onPageChange($event): void {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }
    private _getSubsections(limit: number, offset: number): Observable<ServerResponse<Subsection[]>> {
        return this._mainService.getByUrl(this._urls.subsectionMainUrl, limit, offset).pipe(
            map((data: ServerResponse<Subsection[]>) => {
                this.subsections = data.data;
                return data
            })
        )
    }

    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }
    public openModal(isNew?: boolean, id?: number): void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddSubsectionModal, {
            width: '80vw',
            minHeight: '48vh',
            maxHeight: '85vh',
            autoFocus:false,
            data: { title: isNewTitle, url: this._urls.subsectionGetOneUrl, id: id }
        })
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                if (data.value) {
                    if (data.id) {
                        this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
                    } else {
                        let page = this._appService.getPaginatorLastPage(this._count, this._pageLength, this._paginatorLastPageNumber)
                        this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
                        this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
                    }
                }
            }
        })
    }
    public getBooleanVariable(variable: number): boolean {
        return this._appService.getBooleanVariable(variable)
    }
    public delete(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._urls.subsectionGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.subsections, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        })
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
    get page(): number {
        return this._page;
    }
    get pageLength(): number {
        return this._pageLength;
    }
    get count(): number {
        return this._count
    }
}
import { Component, Input, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AddUnitModal } from '../../../views/main/fixed-assets/modals';
import { ServerResponse, ShortModel, DataCount } from '../../../models/global.models';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, AppService } from '../../../services';
import { AddPositionModal } from '../../../views/main/salary/modals';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainService } from '../../../views/main/main.service';

@Component({
    selector: 'app-name-code-table',
    templateUrl: 'name-code-table.component.html',
    styleUrls: ['name-code-table.component.scss']
})
export class NameCodeTableComponent {
    private _modalTitle: string;
    private _url: string;
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription;
    public titles = [
        // { title: 'Կոդ' },
        { title: 'Անվանում' }
    ]
    @Input('url')
    set setUrl($event) {
        this._url = $event;
        if (this._url == this._urls.positionGetOneUrl) {
            this.titles.push({ title: 'Ստորաբաժանում' })
        }
    }
    @Input('mainUrl') private _mainUrl: string
    @Input('title')
    set setTitle($event) {
        this._modalTitle = $event
        this._title.setTitle($event)
    }

    public data: ShortModel[] = []
    constructor(private _matDialog: MatDialog, private _title: Title, private _mainService: MainService, private _router: Router,
        private _activatedRoute: ActivatedRoute, private _loadingService: LoadingService, private _appService: AppService,
        @Inject('URL_NAMES') private _urls) { }

    ngOnInit() {
        this._checkParams()
    }
    private _combineObservable(limit: number, offset: number): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getCount(),
            this._getArray(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading()
        )
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

    private _getCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._mainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    public addUnit(isNew: boolean, id?: number): void {
        this._openModal(isNew, id)
    }
    public onPageChange($event): void {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }
    private _getArray(limit: number, offset: number): Observable<ServerResponse<ShortModel[]>> {
        if (this._url) {
            return this._mainService.getByUrl(this._mainUrl, limit, offset).pipe(
                map((data: ServerResponse<ShortModel[]>) => {
                    this.data = data.data;
                    return data
                })
            )
        }
    }
    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }
    private _openModal(isNew: boolean, id?: number): void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let modalName: any = (this._url == this._urls.positionGetOneUrl) ? AddPositionModal : AddUnitModal;
        let paramsObject = {
            width: '700px',
            data: { title: isNewTitle, url: this._url, id: id },
            autoFocus:false
        }
        if(this._url == this._urls.positionGetOneUrl){
            paramsObject['height']='32vh'
        }
        let dialog = this._matDialog.open(modalName,
            paramsObject
        )
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
    public delete(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._url, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.data, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        }
            // () => {
            //     this._loadingService.hideLoading()
            // }
        )
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
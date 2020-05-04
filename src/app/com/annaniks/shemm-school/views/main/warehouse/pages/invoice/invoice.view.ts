import { Component, Inject, Input } from "@angular/core";
import { InvoiceModal } from '../../modals';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';

@Component({
    selector: 'invoice-view',
    templateUrl: 'invoice.view.html',
    styleUrls: ['invoice.view.scss']
})
export class InvoiceView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _mainUrl: string;
    private _getOneUrl: string;
    private _modalTitle: string = 'Հաշիվ-ապրանքագիր';
    public invoices: any[] = []
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription
    public titles = [
        { title: 'Փաստաթղթի N' }, { title: 'Գնորդ' }
    ]
    @Input('mainUrl')
    set setMainUrl($event) {
        this._mainUrl = $event
    }
    @Input('getOneUrl')
    set setGetOneUrl($event) {
        this._getOneUrl = $event
    }
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
            this._getInvoiceCount(),
            this._getInvoice(limit, offset)
        )
        this._subscription = combine.subscribe(() => {this._loadingService.hideLoading()})
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
    private _getInvoiceCount(): Observable<ServerResponse<DataCount>> {
        let url=this._mainUrl?this._mainUrl:this._urls.invoiceMainUrl
        return this._mainService.getCount(url).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getInvoice(limit: number, offset: number): Observable<ServerResponse<any[]>> {
        let url=this._mainUrl?this._mainUrl:this._urls.invoiceMainUrl
        return this._mainService.getByUrl(url, limit, offset).pipe(
            map((data: ServerResponse<any[]>) => {
                this.invoices = data.data;
                return data
            })
        )
    }
    public addInvoice(isNew: boolean, id?: number): void {
        this._openModal(isNew, id)
    }
    public onPageChange($event): void {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }


    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }
    private _openModal(isNew: boolean, id?: number): void {
        let url=this._getOneUrl?this._getOneUrl:this._urls.invoiceGetOneUrl

        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(InvoiceModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            autoFocus: false,
            data: { title: isNewTitle, url: url, id: id }
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
        let url=this._getOneUrl?this._getOneUrl:this._urls.invoiceGetOneUrl
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(url, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.invoices, this._page)
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
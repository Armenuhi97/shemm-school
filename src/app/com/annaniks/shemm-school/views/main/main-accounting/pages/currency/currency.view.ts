import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddCurrencyModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main.service';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { DataCount, ServerResponse, Currency } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';

@Component({
    selector: 'currency-view',
    templateUrl: 'currency.view.html',
    styleUrls: ['currency.view.scss']
})
export class CurrencyView {
    public titles = [{ title: 'Կոդ' }, { title: 'Անվանում' }]
    private _url: string = 'currencies';
    private _otherUrl: string = 'currency'
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Արտայժույթներ'
    private _paginatorLastPageNumber: number = 0;
    public currencies: Currency[] = []
    private _subscription: Subscription;
    constructor(private _matDialog: MatDialog, private _title: Title,
        private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService) {
        this._title.setTitle(this._modalTitle)
    }
    ngOnInit() {
        this._checkParams()
    }
    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getCurrencyCount(),
            this._getCurrency(limit, offset)
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
    private _getCurrencyCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._url).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getCurrency(limit: number, offset: number) {
        return this._mainService.getByUrl(this._url, limit, offset).pipe(
            map((data: ServerResponse<Currency[]>) => {
                this.currencies = data.data;
                return data
            })
        )
    }
    public addCurrency(isNew: boolean, id?: number) {
        this._openModal(isNew, id)
    }
    public onPageChange($event) {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }

    public lastPage($event: number) {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }

    public getBooleanVariable(variable: number) {
        return this._appService.getBooleanVariable(variable)
    }
    public delete(id: number) {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._otherUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.currencies, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        })
    }

    private _openModal(isNew: boolean, id?: number) {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddCurrencyModal, {
            width: '500px',
            data: { title: isNewTitle, url: this._otherUrl, id: id }
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
    ngOnDestroy() {
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
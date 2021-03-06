import { Component, Inject } from "@angular/core";
import { PaymentFromCurrencyAccountModal } from '../../modals';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../main.service';

@Component({
    selector:'payment-from-current-account-view',
    templateUrl:'payment-from-current-account.view.html',
    styleUrls:['payment-from-current-account.view.scss']
})
export class PaymentFromCurrentAccountView { 
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Վճարումներ հաշվարկային հաշվից';
    public paymentFromCurrentAccount = []
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription
    public titles: Array<{ title: string }> = [{ title: 'Փաստաթղթի N' }, { title: 'Ծախսի հաշիվ' }]
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
            this._getPaymentFromCurrentAccountCount(),
            this._getPaymentFromCurrentAccount(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
    }
    private _checkParams(): void {
        this._resetProperties()
        this._activatedRoute.queryParams.subscribe((queryparams) => {
            if (queryparams && queryparams.page) {
                this._page = +queryparams.page;
            }
            // this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
        })

    }
    private _getPaymentFromCurrentAccountCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.materialValuesShiftMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getPaymentFromCurrentAccount(limit: number, offset: number): Observable<ServerResponse<any[]>> {
        return this._mainService.getByUrl(this._urls.materialValuesShiftMainUrl, limit, offset).pipe(
            map((data: ServerResponse<any[]>) => {
                this.paymentFromCurrentAccount = data.data;
                return data
            })
        )
    }
    public add(isNew: boolean, id?: number): void {
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
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(PaymentFromCurrencyAccountModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            autoFocus: false,
            data: { title: isNewTitle, url: this._urls.materialValuesShiftGetOneUrl, id: id }
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
        this._mainService.deleteByUrl(this._urls.materialValuesShiftGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.paymentFromCurrentAccount, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        })
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        // this._subscription.unsubscribe()
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
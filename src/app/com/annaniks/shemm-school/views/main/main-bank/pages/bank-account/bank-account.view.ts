import { Component, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataCount, ServerResponse, BankAccount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { AddBankAccountModal } from '../../../main-accounting/modals';

@Component({
    selector: 'bank-account-view',
    templateUrl: 'bank-account.view.html',
    styleUrls: ['bank-account.view.scss']
})
export class BankAccountView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Հաշվարկային հաշիվներ բանկում'
    private _paginatorLastPageNumber: number = 0;
    public bankAccounts: any[] = [];
    private _subscription: Subscription;
    public titles = [
        { title: 'Հաշվարկային հաշիվ' },
        { title: 'Անվանում' },
        { title: 'Արժույթ' },
        { title: 'Հաշիվ' },
        { title: 'Հիմնական' },
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
    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getBankAccountCount(),
            this._getBankAccount(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
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
    private _getBankAccountCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.bankAccountMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getBankAccount(limit: number, offset: number): Observable<ServerResponse<BankAccount[]>> {
        return this._mainService.getByUrl(this._urls.bankAccountMainUrl, limit, offset).pipe(
            map((data: ServerResponse<BankAccount[]>) => {
                this.bankAccounts = data.data;
                return data
            })
        )
    }

    public addBankAccount(isNew?: boolean, id?: number) {
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
    private _openModal(isNew?: boolean, id?: number) {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog =
            this._matDialog.open(AddBankAccountModal, {
                width: '800px',
                autoFocus: false,
                data: { title: isNewTitle, url: this._urls.bankAccountGetOneUrl, id: id, mainUrl: this._urls.bankAccountMainUrl }
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
    public getBooleanVariable(variable: string) {
        return this._appService.getBooleanVariable(variable)
    }
    public delete(id: number) {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._urls.bankAccountGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.bankAccounts, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        },
            () => {
                this._loadingService.hideLoading()
            })
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        if (this._subscription)
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
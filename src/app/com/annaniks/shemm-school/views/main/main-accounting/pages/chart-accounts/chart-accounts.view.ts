import { Component, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddAccountModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { ServerResponse, DataCount, AccountPlans } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { ChartAccountsService } from './chart-accounts.service';

@Component({
    selector: 'chart-accounts-view',
    templateUrl: 'chart-accounts.view.html',
    styleUrls: ['chart-accounts.view.scss']
})
export class ChartAccountsView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Հաշվային պլան'
    private _paginatorLastPageNumber: number = 0;
    public chartAccounts: AccountPlans[] = []
    private _subscription: Subscription
    public titles = [
        { title: 'Հաշիվ' }, { title: 'Անվանում' },
        { title: 'Տեսակ' }, { title: 'Կուտակիչ' },
        { title: 'Արտահաշիվ' }, { title: 'Գործընկ․' },
        { title: 'Ան․խումբ 1' }, { title: 'Ան․խումբ 2' },
        { title: 'Նկարագրություն' }
    ]
    constructor(private _matDialog: MatDialog, private _title: Title,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _chartAccountService: ChartAccountsService,
        private _appService: AppService, private _loadingService: LoadingService,
        @Inject('URL_NAMES') private _urls) {
        this._title.setTitle(this._modalTitle);

    }
    ngOnInit() {
        this._checkParams()
    }
    public addChartAccount(isNew?: boolean, id?: number):void {
        this._openModal(isNew, id)
    }
    private _combineObservable(limit: number, offset: number): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getAccountsPlanCount(),
            this._getAccountsPlan(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
            () => this._loadingService.hideLoading()
        )
    }
    private _getAccountsPlanCount(): Observable<ServerResponse<DataCount>> {
        return this._chartAccountService.getAccountsCount().pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getAccountsPlan(limit: number, offset: number): Observable<ServerResponse<AccountPlans[]>> {
        return this._chartAccountService.getAccounts(limit, offset).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.chartAccounts = data.data;
                return data
            })
        )
    }
    private _checkParams(): void {
        this._resetProperties();
        this._activatedRoute.queryParams.subscribe((queryParams) => {
            if (queryParams && queryParams.page) {
                this._page = +queryParams.page;
            }
            this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
        })
    }

    public onPageChange($event) {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }

    private _resetProperties(): void {
        this._page = 1
    }

    private _openModal(isNew?: boolean, id?: number):void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddAccountModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            data: { title: isNewTitle, url: this._urls.accountPlanGetOneUrl, id: id }
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
    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }
    public delete(id: number): void {
        this._loadingService.showLoading()
        this._chartAccountService.deleteAccount(id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.chartAccounts, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        }
            // , () => { this._loadingService.hideLoading() }
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
import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ServerResponse, DataCount, BankPayload } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AddBank } from '../../modals';


@Component({
    selector: 'bank-view',
    templateUrl: 'bank.view.html',
    styleUrls: ['bank.view.scss']
})
export class BankView {

    private _url: string = 'banks';
    private _otherUrl: string = 'bank'
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Բանկ'
    private _paginatorLastPageNumber: number = 0;
    public banks: BankPayload[] = [];
    public titles = [
        { title: 'Կոդ' },
        { title: 'Անվանում' },
        { title: 'SWIFT կոդ' }
    ];
    private _subscription: Subscription;
    constructor(
        private _matDialog: MatDialog,
        private _title: Title,
        private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService) {
        this._title.setTitle('Բանկեր')
    }
    ngOnInit() {
        this._checkParams();

    }

    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getBankCount(),
            this._getBank(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
            () => this._loadingService.hideLoading())
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
    private _getBankCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._url).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getBank(limit: number, offset: number): Observable<ServerResponse<BankPayload[]>> {
        return this._mainService.getByUrl(this._url, limit, offset).pipe(
            map((data: ServerResponse<BankPayload[]>) => {
                this.banks = data.data;
                return data
            })
        )
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

    public delete(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._otherUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.banks, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        },
            () => {
                this._loadingService.hideLoading()
            })
    }

    public addBank(isNew?: boolean, id?: number, item?) {
        this.openModal(isNew, id, item)
    }

    public openModal(isNew?: boolean, id?: number, item?): void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddBank, {
            width: '500px',
            autoFocus: false,
            data: { title: isNewTitle, url: this._otherUrl, id: id, item }
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

    get page(): number {
        return this._page;
    }
    get pageLength(): number {
        return this._pageLength;
    }
    get count(): number {
        return this._count
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe()
    }


}
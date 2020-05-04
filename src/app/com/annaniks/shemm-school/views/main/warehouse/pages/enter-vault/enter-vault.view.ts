import { Component, Inject } from "@angular/core";
import { ServerResponse, DataCount, EnterVaults } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MatDialog } from '@angular/material/dialog';
import { EnterVaultModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'enter-vault-view',
    templateUrl: 'enter-vault.view.html',
    styleUrls: ['enter-vault.view.scss']
})
export class EnterVaultView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Պահեստի մուտքի օրդեր';
    public enterVaults: EnterVaults[] = []
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription
    public titles: Array<{ title: string }> = [{ title: 'Ամսաթիվ' }, { title: 'Պահեստ' }]
    constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService,
        private _datePipe: DatePipe,
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
            this._getEnterVaultCount(),
            this._getEnterVault(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
    }
    public getDate(item: EnterVaults): string {
        return this._datePipe.transform(new Date(item.date), 'dd/MM/yyyy')
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
    private _getEnterVaultCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.warehouseEntryOrderMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getEnterVault(limit: number, offset: number): Observable<ServerResponse<EnterVaults[]>> {
        return this._mainService.getByUrl(this._urls.warehouseEntryOrderMainUrl, limit, offset).pipe(
            map((data: ServerResponse<EnterVaults[]>) => {
                this.enterVaults = data.data;
                return data
            })
        )
    }
    public addEnterVault(isNew?: boolean, id?: number): void {
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
    private _openModal(isNew?: boolean, id?: number): void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(EnterVaultModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            autoFocus: false,
            data: { title: isNewTitle, url: this._urls.warehouseEntryOrderGetOneUrl, id: id }
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
        this._mainService.deleteByUrl(this._urls.warehouseEntryOrderGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.enterVaults, this._page)
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
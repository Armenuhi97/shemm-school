import { Component, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AddAdditionModal } from '../../modals';
import { ServerResponse, DataCount, Additions } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainService } from '../../../main.service';

@Component({
    selector: 'addition-view',
    templateUrl: 'addition.view.html',
    styleUrls: ['addition.view.scss']
})
export class AdditionView {
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Աշխատավարձի տեսակ'
    private _paginatorLastPageNumber: number = 0;
    public additions: Additions[] = [];
    private _subscription: Subscription
    public titles = [
        { title: 'Անվանում' },
        { title: 'Աշխատավարձի հաշվման եղանակ' },
        // { title: 'Տաբելային կոդ' },
        { title: 'Գործակից' },
        { title: 'Եկամտի տեսակ' },
        { title: 'Ծախսի հաշիվ' },
        { title: 'Մասնակցում է արձակուրդայինի կենսաթոշակը միջինի մեջ' },
        { title: 'Հետհաշվարկ' }
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
            this._getAdditionCount(),
            this._getAddition(limit, offset)
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
    private _getAdditionCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.additionMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }

    public addAddition(isNew?: boolean, id?: number): void {
        this._openModal(isNew, id)
    }
    public onPageChange($event): void {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }
    private _getAddition(limit: number, offset: number): Observable<ServerResponse<Additions[]>> {
        return this._mainService.getByUrl(this._urls.additionMainUrl, limit, offset).pipe(
            map((data: ServerResponse<Additions[]>) => {
                this.additions = data.data;
                return data
            })
        )
    }

    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }
    private _openModal(isNew?: boolean, id?: number): void {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddAdditionModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            autoFocus: false,
            data: { title: isNewTitle, url: this._urls.additionGetOneUrl, id: id }
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
        this._mainService.deleteByUrl(this._urls.additionGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.addAddition, this._page)
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
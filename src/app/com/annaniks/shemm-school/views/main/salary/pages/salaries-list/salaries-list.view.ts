import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'salaries-list-view',
    templateUrl: 'salaries-list.view.html',
    styleUrls: ['salaries-list.view.scss']
})
export class SalariesListView {

    private _subscription: Subscription
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Աշխատավարձերի ցանկ';
    public groupSalaries = []
    private _paginatorLastPageNumber: number = 0;
    public titles: Array<{ title: string }> =
        [
            { title: 'Կոդ' },
            { title: 'Ամսաթիվ' },
            { title: 'Հարկվող' },
            { title: 'Չհարկվող' },
            { title: 'Չի մասնակցում արձակուրդայինի կենսաթոշակը միջինի մեջ' },
        ]

    constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService,
        private _datePipe: DatePipe,
        private _messageService:MessageService,
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
            this._getSalariesGroupCount(),
            this._getSalariesGroup(limit, offset)
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
    private _getSalariesGroupCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.groupSalariesMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getSalariesGroup(limit: number, offset: number): Observable<ServerResponse<any[]>> {
        return this._mainService.getByUrl(this._urls.groupSalariesMainUrl, limit, offset).pipe(
            map((data: ServerResponse<any[]>) => {
                this.groupSalaries = data.data;
                return data
            })
        )
    }
    public show(isNew: boolean, id?: number): void {
        this._showEntity(isNew, id)
    }
    public getDate(item): string {
        return item.date ? this._datePipe.transform(new Date(item.date), 'yyyy/MM') : item.date
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
    private _showEntity(isNew: boolean, id?: number): void {
        this._router.navigate([`salary/salaries-list/${id}`])

    }
    public getBooleanVariable(variable: number): boolean {
        return this._appService.getBooleanVariable(variable)
    }
    public delete(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._urls.groupSalariesGetOneUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.groupSalaries, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        }, (err) => {
            this._mainService.translateServerError(err)
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
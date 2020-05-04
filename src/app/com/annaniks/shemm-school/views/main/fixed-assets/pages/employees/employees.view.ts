import { Component, Input, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { EmployeesModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ServerResponse, DataCount, Employees } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'employees-view',
    templateUrl: 'employees.view.html',
    styleUrls: ['employees.view.scss']
})
export class EmployeeView {
    private _modalTitle: string = "Աշխատակիցներ";
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription;
    private _mainUrl: string = this._urls.employeeOfFixedAssetsMainUrl;
    private _url: string = this._urls.employeeOfFixedAssetsGetOneUrl;
    public employees: Employees[] = []
    @Input('isSalary')
    set setIsSalary($event) {
        if ($event) {
            this._mainUrl = this._urls.employeeMainUrl;
            this._url = this._urls.employeeGetOneUrl
        }
    }
    public titles = [
        { title: 'Տաբելային համար' }, { title: 'Ազգանուն, անուն, հայրանուն' },
        // { title: 'Ստորաբաժանում'}, { title: 'Անվանում'},
        { title: 'Պաշտոն' }, { title: 'Դրույքաչափ' },
        // { title: 'Պաշտոնի տեսակը'}, { title: 'Ընդունման ամսաթիվ'},  { title: 'Ազատման ամսաթիվ'},
        { title: 'Ծննդյան ամսաթիվ' }, { title: 'Սեռ' },
        { title: 'Հեռախոս' }, { title: 'Անձնագիր' }, { title: 'Աշխատանկցի հաշիվը բանկում' },
        // { title: 'Մասնագիտություն'},  { title: 'ՀՀ քազաքացի(Ռեզիդենտ)' }
    ]
    constructor(private _matDialog: MatDialog, private _title: Title, private _mainService: MainService, private _router: Router,
        private _activatedRoute: ActivatedRoute, private _loadingService: LoadingService, private _appService: AppService,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls
    ) {
        this._title.setTitle(this._modalTitle);
    }
    ngOnInit() {
        this._checkParams()
    }
    public getDate(date) {
        return date ? this._datePipe.transform(new Date(date), 'dd/MM/yyyy') : null
    }
    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getCount(),
            this._getEmployees(limit, offset)
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

    private _getCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._mainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    public onPageChange($event) {
        if ($event.isArrow)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
    }
    private _resetProperties(): void {
        this._page = 1;
    }
    private _getEmployees(limit: number, offset: number): Observable<ServerResponse<Employees[]>> {
        return this._mainService.getByUrl(this._mainUrl, limit, offset).pipe(
            map((data: ServerResponse<Employees[]>) => {
                this.employees = data.data;
                return data
            })
        )
    }
    public lastPage($event: number): void {
        if ($event)
            this._paginatorLastPageNumber = $event;
    }

    public deleteEmployee(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._url, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.employees, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
        })
    }

    public addEmployee(isNew: boolean, id?: number): void {
        this._openModal(isNew, id)
    }

    private _openModal(isNew: boolean, id?: number): void {
        let newTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(EmployeesModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '88vh',
            data: { title: newTitle, url: this._url, id: id },
            autoFocus: false
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
import { Component, Inject } from "@angular/core";
import { forkJoin, Observable, Subscription } from 'rxjs';
import { DataCount, ServerResponse, AnalyticalGroup } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { AddAnalyticGroupModal } from '../../modals';

@Component({
    selector: 'analytical-group-view',
    templateUrl: 'analytical-group.view.html',
    styleUrls: ['analytical-group.view.scss']
})
export class AnalyticalGroupView {
    private _url: string;
    private _otherUrl: string
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Անալիտիկ խումբ '
    private _paginatorLastPageNumber: number = 0;
    public analyticGroup: AnalyticalGroup[] = [];
    private _subscription: Subscription;
    private _groupNumber: number;
    public titles = [
        { title: 'Կոդ' },
        { title: 'Անվանում' },
        { title: 'Կուտակիչ խումբ' },
        // { title: 'Կուտակիչ' },
    ]
    constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls

    ) {
        this._setGroupNumber()
    }
    private _setGroupNumber() {
        this._groupNumber = +this._activatedRoute.data['_value'].group;
        this._modalTitle += this._groupNumber.toString();
        this._title.setTitle(this._modalTitle)
        if (this._groupNumber == 2) {
            this._url =  this._urls.analyticGroup2MainUrl;
            this._otherUrl = this._urls.analyticGroup2GetOneUrl;
        } else {
            if (this._groupNumber == 1) {
                this._url = this._urls.analyticGroup1MainUrl;
                this._otherUrl = this._urls.analyticGroup1GetOneUrl;
               
            }

        }
    }
    ngOnInit() {
        this._checkParams()
    }
    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getAnalyticGroup1Count(),
            this._getAnalyticGroup1(limit, offset)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
            // () => this._loadingService.hideLoading()
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
    private _getAnalyticGroup1Count(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._url).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getAnalyticGroup1(limit: number, offset: number): Observable<ServerResponse<AnalyticalGroup[]>> {
        return this._mainService.getByUrl(this._url, limit, offset).pipe(
            map((data: ServerResponse<AnalyticalGroup[]>) => {
                this.analyticGroup = data.data;
                return data
            })
        )
    }

    public addAnalyticGroup(isNew?: boolean, id?: number) {
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
            this._matDialog.open(AddAnalyticGroupModal, {
                width: '800px',
                autoFocus:false,
                data: { title: isNewTitle, url: this._otherUrl, id: id, mainUrl: this._url }
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
        this._mainService.deleteByUrl(this._otherUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.analyticGroup, this._page)
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
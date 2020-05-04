import { Component, Inject } from "@angular/core";
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount, Classifier } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { ClassifierModal } from '../../modals';

@Component({
    selector: 'classifier-view',
    templateUrl: 'classifier.view.html',
    styleUrls: ['classifier.view.scss']
})
export class ClassifierView {
    public classifiers: Classifier[] = []
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'ԱՏԳԱԱ և ԱԴԳՏ դասակարգիչ';
    private _paginatorLastPageNumber: number = 0;
    private _subscription: Subscription
    public titles = [
        { title: 'Կոդ' }, { title: 'Անվանում' }, { title: 'Տեսակ' }
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
    private _combineObservable(limit: number, offset: number): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getClassifierCount(),
            this._getClassifier(limit, offset)
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
    private _getClassifierCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._urls.classifierMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getClassifier(limit: number, offset: number): Observable<ServerResponse<Classifier[]>> {
        return this._mainService.getByUrl(this._urls.classifierMainUrl, limit, offset).pipe(
            map((data: ServerResponse<Classifier[]>) => {
                this.classifiers = data.data;
                return data
            })
        )
    }
    public addClassifier(isNew?: boolean, id?: number): void {
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
        let dialog = this._matDialog.open(ClassifierModal, {
            width: '600px',
            autoFocus:false,
            data: { title: isNewTitle, url: this._urls.classifierGetOneUrl, id: id }
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
        this._mainService.deleteByUrl(this._urls.classifierGetOneUrl, id).subscribe(() => {
            let page = this._appService.setAfterDeletedPage(this.classifiers, this._page);

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
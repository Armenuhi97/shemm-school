import { Component, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddPartnerModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { ServerResponse, Partners, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
    selector: 'partners-view',
    templateUrl: 'partners.view.html',
    styleUrls: ['partners.view.scss']
})
export class PartnersView {
    public titles = [
        { title: 'Կոդ' }, { title: 'Անվանում' }, { title: 'ՀՎՀՀ' }, { title: 'Էլ․ փոստ' }, { title: 'Հեռախոսահամար' },
        { title: 'Պայմանագիր' }, { title: 'Իրավ․ հասցե' }, { title: 'Գործ․ հասցե' }]
    private _url: string;
    private _otherUrl: string;
    private _pageLength: number = 10;
    private _count: number = 0;
    private _page: number = 1;
    private _modalTitle: string = 'Գործընկերներ'
    private _paginatorLastPageNumber: number = 0;
    public partners: Partners[] = [];
    private _subscription: Subscription
    constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
        private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this._url = this._urls.partnerMainUrl;
        this._otherUrl = this._urls.partnerGetOneUrl
        this._title.setTitle(this._modalTitle)
    }
    ngOnInit() {
        this._checkParams()
    }
    public isPhoneStartWithCode(phone: string): string {
        return phone.startsWith('+374') ? phone : '+374' + phone
    }
    private _combineObservable(limit: number, offset: number) {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getPartnerCount(),
            this._getPartners(limit, offset)
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
    private _getPartnerCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._url).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                return data
            })
        )
    }
    private _getPartners(limit: number, offset: number): Observable<ServerResponse<Partners[]>> {
        return this._mainService.getByUrl(this._url, limit, offset).pipe(
            map((data: ServerResponse<Partners[]>) => {
                this.partners = data.data;
                return data
            })
        )
    }
    public addAddition(isNew: boolean, id?: number) {
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
    private _openModal(isNew: boolean, id?: number) {
        let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
        let dialog = this._matDialog.open(AddPartnerModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            autoFocus:false,
            data: { title: isNewTitle, url: this._otherUrl, id: id }
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
    public getBooleanVariable(variable: number) {
        return this._appService.getBooleanVariable(variable)
    }
    public addPartner(isNew: boolean, id?: number) {
        this._openModal(isNew, id)
    }
    public delete(id: number) {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._otherUrl, id).subscribe((data) => {
            let page = this._appService.setAfterDeletedPage(this.partners, this._page)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
            this._loadingService.hideLoading()
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
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
}
import { Component, OnInit } from '@angular/core';
import { AddPriceOfServiceModal } from '../../modals';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { PriceOfServicesDetail, ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-price-of-services',
  templateUrl: './price-of-services.view.html',
  styleUrls: ['./price-of-services.view.scss']
})
export class PriceOfServicesView implements OnInit {


  private _url: string = 'price-of-services';
  private _otherUrl = 'price-of-service';
  private _paginatorLastPageNumber: number = 0;
  private _modalTitle: string = 'Ծառայության գին';
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  public priceOfServicesDetail: PriceOfServicesDetail[] = [];
  public titles = [
    { title: 'Սկիզբ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Ավարտ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Տիպ', isSort: false, arrow: '', min: false, max: false }
  ];

  constructor(private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _mainService: MainService
  ) {
    this._title.setTitle(this._modalTitle)
  }

  ngOnInit() {
    this._checkParams()
  }

  public lastPage($event: number) {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  public onPageChange($event) {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }
  public addPriceOfService(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew?: boolean, id?: number, item?: PriceOfServicesDetail) {
    let dialog = this._matDialog.open(AddPriceOfServiceModal, {
      width: '50vw',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: this._modalTitle, url: this._otherUrl, id: id, item , label: this._modalTitle}
    })
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        if (data.value) {
          if (data.id) {
            this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
          } else {
            let page = this._appService.getPaginatorLastPage(this._count, this._pageLength, this._paginatorLastPageNumber)
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page } })
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
          }
        }
      }
    })
  }

  private _getPriceOfServices(limit: number, offset: number): Observable<ServerResponse<PriceOfServicesDetail[]>> {
    return this._mainService.getByUrl(this._url, limit, offset).pipe(
      map((data: ServerResponse<PriceOfServicesDetail[]>) => {
        this.priceOfServicesDetail = data.data
        return data
      })
    )
  }

  private _getPriceOfServicesCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._url).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
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

  private _resetProperties(): void {
    this._page = 1
  }
  
  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getPriceOfServicesCount(),
      this._getPriceOfServices(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._otherUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.priceOfServicesDetail, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
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

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

}

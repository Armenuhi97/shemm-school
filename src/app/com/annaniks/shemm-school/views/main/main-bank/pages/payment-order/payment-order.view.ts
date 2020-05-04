import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataCount, ServerResponse } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { PaymentOrderModal } from '../../modals/payment-order/payment-order․modal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-order',
  templateUrl: './payment-order.view.html',
  styleUrls: ['./payment-order.view.scss']
})
export class PaymentOrderComponent implements OnInit {
  private _modalTitle = 'Վճարման հանձնարարագիր';
  private _paginatorLastPageNumber: number = 0;
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  public payments: any[] = [];
  public titles: Array<{ title: string }> = [{ title: 'Ամսաթիվ' }, { title: 'Փաստաթղթի համար' }]

  constructor(private _matDialog: MatDialog,
    private _title: Title,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _appService: AppService,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _datePipe:DatePipe,
    @Inject('URL_NAMES') private _urls
  ) {
    this._title.setTitle(this._modalTitle)
  }

  ngOnInit(): void {
    this._checkParams()
  }
  public getDate(item): string {
    return this._datePipe.transform(new Date(item.date), 'dd/MM/yyyy')
}
  public lastPage($event: number): void {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  public onPageChange($event): void {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
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

  public addPayment(isNew?: boolean, id?: number, item?): void {
    this._openModal(isNew, id, item)
  }
  private _openModal(isNew?: boolean, id?: number, item?: any): void {
    let newTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';

    let dialog = this._matDialog.open(PaymentOrderModal, {
      width: '80vw',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: newTitle, url: this._urls.paymentOrderGetOneUrl, id: id, item }
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

  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getPaymentOrderCount(),
      this._getPaymentOrders(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  private _getPaymentOrderCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.paymentOrderMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _getPaymentOrders(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.paymentOrderMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.payments = data.data;
        return data
      })
    )
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._urls.paymentOrderGetOneUrl, id).subscribe(() => {
      let page = this._appService.setAfterDeletedPage(this.payments, this._page)
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

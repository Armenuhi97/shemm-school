import { Component, OnInit } from '@angular/core';
import { BillingMethodPayload, ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main.service';
import { AddBillingMethodModal } from '../../modals';

@Component({
  selector: 'app-billing-method',
  templateUrl: './billing-method.component.html',
  styleUrls: ['./billing-method.component.scss']
})
export class BillingMethodComponent implements OnInit {

  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Հաշվառման մեթոդ';
  private _billingMethodMainUrl: string = 'billing-methods';
  private _billingMethodOtherUrl: string = 'billing-method';

  public billingMethods: BillingMethodPayload[] = []
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles = [
    { title: 'Կոդ' }, { title: 'Հապավում' }
  ]
  constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
    private _appService: AppService
  ) {
    this._title.setTitle(this._modalTitle)
  }

  ngOnInit() {
    this._checkParams()
  }

  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getBillingMethodCount(),
      this._getBillingMethods(limit, offset)
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

  private _getBillingMethodCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._billingMethodMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  public addBillingMethod(isNew?: boolean, id?: number, item?: BillingMethodPayload) {
    this.openModal(isNew, id, item)
  }

  public onPageChange($event) {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }

  private _resetProperties(): void {
    this._page = 1;
  }

  private _getBillingMethods(limit: number, offset: number) {
    return this._mainService.getByUrl(this._billingMethodMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.billingMethods = data.data;
        return data
      })
    )
  }

  public lastPage($event: number) {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }


  public openModal(isNew?: boolean, id?: number, item?: BillingMethodPayload) {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddBillingMethodModal, {
      width: '850px',
      maxHeight: '85vh',
      autoFocus:false,
      data: { title: isNewTitle, url: this._billingMethodOtherUrl, id, item }
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

  public delete(id: number) {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._billingMethodOtherUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.billingMethods, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    })
  }
  ngOnDestroy() {
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

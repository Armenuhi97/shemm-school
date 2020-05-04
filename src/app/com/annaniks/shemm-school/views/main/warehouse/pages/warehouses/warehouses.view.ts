import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddWarehouseModal } from '../../modals';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { IWarehouseDetail, ServerResponse, DataCount, AccountPlans } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators'
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { WarehousesService } from './warehouses.service';


@Component({
  selector: 'warehouses-view',
  templateUrl: 'warehouses.view.html',
  styleUrls: ['warehouses.view.scss']
})
export class WarehousesView {
  private _url: string = 'warehouse';
  private _paginatorLastPageNumber: number = 0;
  private _modalTitle: string = 'Պահեստ';
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  public warehouses: IWarehouseDetail[] = [];
  public titles = [
    { title: 'Կոդ' },
    { title: 'Անվանում' },
    { title: 'Պահեստապետ' },
    { title: 'Հասցե' },
    // {title:'Պահեստի նշանակություն'}
  ]
  constructor(private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _loadingService: LoadingService,
    private _warehousesService: WarehousesService,
    private _appService: AppService,
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

  public addWarehouse(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item);
  }


  public openModal(isNew?: boolean, id?: number, item?: IWarehouseDetail) {
    let dialog = this._matDialog.open(AddWarehouseModal, {
      width: '700px',
      maxHeight: '85vh',
      autoFocus:false,
      data: { title: this._modalTitle, url: this._url, id: id, item }
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

  private _checkParams() {
    this._resetProperties();
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams && queryParams.page) {
        this._page = +queryParams.page;
      }
      this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
    })
  }

  private _resetProperties() {
    this._page = 1
  }

  private _getAccountsPlan(limit: number, offset: number): Observable<ServerResponse<any>> {
    return this._warehousesService.getWarehouses(limit, offset).pipe(
      map((data: ServerResponse<any>) => {
        this.warehouses = data.data
        return data
      })
    )
  }

  private _getAccountsPlanCount(): Observable<ServerResponse<DataCount>> {
    return this._warehousesService.getWarehousesCount().pipe(
      map((data: any) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getAccountsPlanCount(),
      this._getAccountsPlan(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._warehousesService.deleteWarehouse(id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.warehouses, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page }, })
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

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}

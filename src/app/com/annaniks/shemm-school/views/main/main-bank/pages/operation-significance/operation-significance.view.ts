import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ServerResponse, DataCount, IOperationSignificance } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AddOperationSignificanceModal } from '../../modals';

@Component({
  selector: 'app-operation-significance',
  templateUrl: './operation-significance.view.html',
  styleUrls: ['./operation-significance.view.scss']
})
export class OperationSignificanceView implements OnInit {

  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Գործառնությունների նշանակություն';
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription;
  public operationSignificance: IOperationSignificance[] = [];
  public titles: Array<{ title: string }> = [
    { title: 'Անվանում' },
    { title: 'Ներհոսքի հաշիվ' },
    { title: 'Արտահոսքի հաշիվ' },
    { title: 'Գործընկերոջ հաշիվ' },
  ];

  constructor(
    private _matDialog: MatDialog,
    private _title: Title,
    private _loadingService: LoadingService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _mainService: MainService,
    private _appService: AppService,
    @Inject('URL_NAMES') private _urls
  ) {
    this._title.setTitle(this._modalTitle);
  }

  ngOnInit() {
    this._checkParams()
  }

  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getOperationSignificanceCount(),
      this._getOperationSignificance(limit, offset)
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

  private _getOperationSignificanceCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.operationSignificancesMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _getOperationSignificance(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.operationSignificancesMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        console.log(this.operationSignificance);

        this.operationSignificance = data.data;
        return data
      })
    )
  }

  public addOperationSignificance(isNew: boolean, id?: number, item?: IOperationSignificance): void {
    this._openModal(isNew, id, item)
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

  private _openModal(isNew: boolean, id?: number, item?: IOperationSignificance): void {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddOperationSignificanceModal, {
      width: '800px',
      minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._urls.operationSignificancesGetOneUrl, id: id, item }
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

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._urls.operationSignificancesGetOneUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.operationSignificance, this._page)
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

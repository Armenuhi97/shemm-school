import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { map } from 'rxjs/operators';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AddHmxValueBalanceModal } from '../../modals';

@Component({
  selector: 'app-hmx-value-balance',
  templateUrl: './hmx-value-balance.view.html',
  styleUrls: ['./hmx-value-balance.view.scss']
})
export class HmxValueBalanceView implements OnInit {

  private _modalTitle: string = "ՀՄ խմբի հաշվեկշռային արժեքներ";
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription;
  public addHmxValueBalanceData = [];
  public titles = [
    { title: 'Կոդ' },
    { title: 'Տարի' },
    { title: 'Հաշվեկշռային արժեք տարվա սկզբին' }

  ];


  constructor(
    @Inject('URL_NAMES') private _urls,
    private _matDialog: MatDialog, private _title: Title, private _mainService: MainService, private _router: Router,
    private _activatedRoute: ActivatedRoute, private _loadingService: LoadingService, private _appService: AppService,
  ) {
    this._title.setTitle(this._modalTitle);
  }
  ngOnInit() {
    this._checkParams()
  }

  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getCount(),
      this._getEmplyees(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => { this._loadingService.hideLoading() })
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

  private _getCount() {
    return this._mainService.getCount(this._urls.hmxValueBalansMainUrl).pipe(
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
  private _getEmplyees(limit: number, offset: number) {
    return this._mainService.getByUrl(this._urls.hmxValueBalansMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.addHmxValueBalanceData = data.data;
        return data
      })
    )
  }
  public lastPage($event: number) {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._urls.hmxValueBalansGetOneUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.addHmxValueBalanceData, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  public addHmxValueBalance(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew?: boolean, id?: number, item?) {
    let newTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddHmxValueBalanceModal, {
      width: '800px',
      maxHeight: '85vh',
      autoFocus:false,
      data: { title: newTitle, url: this._urls.hmxValueBalansGetOneUrl, id: id, item }
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


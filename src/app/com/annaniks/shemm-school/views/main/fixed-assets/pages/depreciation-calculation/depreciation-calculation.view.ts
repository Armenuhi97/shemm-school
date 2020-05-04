import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../main.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { CalculationOfWearModal } from '../../modals';
import { DatePipe } from '@angular/common';
import { LoadingService, AppService } from '../../../../../services';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-depreciation-calculation',
  templateUrl: './depreciation-calculation.view.html',
  styleUrls: ['./depreciation-calculation.view.scss']
})
export class DepreciationCalculationView implements OnInit {
  public depreciationCalculations=[]
  private _modalTitle = 'Մաշվածքի հաշիվ';
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription;
  public titles = [
   {title:'Փաստաթղթի համար'}
]
  constructor(private _matDialog: MatDialog, private _title: Title, private _mainService: MainService, private _router: Router,
    private _activatedRoute: ActivatedRoute, private _loadingService: LoadingService, private _appService: AppService,
    private _datePipe: DatePipe, @Inject('URL_NAMES') private _urls
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
      this._getDepreciationCalculationCount(),
      this._getDepreciationCalculations(limit,offset)
      // TODO: GET DEPRECIATION 
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => { this._loadingService.hideLoading() })
  }
  private _getDepreciationCalculationCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.depreciationCalculationMainUrl).pipe(
        map((data: ServerResponse<DataCount>) => {
            this._count = data.data.count;
            return data
        })
    )
}
private _getDepreciationCalculations(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.depreciationCalculationMainUrl, limit, offset).pipe(
        map((data: ServerResponse<any[]>) => {
            this.depreciationCalculations = data.data;
            return data
        })
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

  public onPageChange($event):void {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }
  private _resetProperties(): void {
    this._page = 1;
  }

  public lastPage($event: number):void {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._urls.depreciationCalculationGetOneUrl, id).subscribe((data) => {
        let page = this._appService.setAfterDeletedPage(this.depreciationCalculations, this._page)
        this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
        this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
        this._loadingService.hideLoading()
    })
}
  public addWearCalcuation(isNew: boolean, id?: number) {
    this._openModal(isNew, id)
  }

  private _openModal(isNew: boolean, id?: number):void {
    let newTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(CalculationOfWearModal, {
      width: '80vw',
      minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus:false,
      data: { title: newTitle, url: this._urls.depreciationCalculationGetOneUrl, id: id }
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

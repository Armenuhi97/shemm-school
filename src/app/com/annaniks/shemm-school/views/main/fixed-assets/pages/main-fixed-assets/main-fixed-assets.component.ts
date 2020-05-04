import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { AcquisitionOperationCalculatorsModal } from '../../modals';

@Component({
  selector: 'main-fixed-assets-view',
  templateUrl: './main-fixed-assets.component.html',
  styleUrls: ['./main-fixed-assets.component.scss']
})
export class MainFixedAssetsComponent implements OnInit {
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Հիմնական միջոցներ';
  public fixedAssets = []
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles: Array<{ title: string }> = [
    { title: 'Գույքային քարտ' }, { title: 'Գույքային համար' },
    { title: 'Անվանում' }, { title: 'ՀՄ տեսակ' },
    { title: 'ՀՄ խումբ շահութահարկի օրենքով' }, { title: 'Ջեռքբերման տեսակ' },
    { title: 'Մատակարար' }, { title: 'Մատակարարի հաշիվ ' },
    { title: 'Մուտքի ամսաթիվ ' }, { title: 'Փաստաթղթի N' },
    { title: 'Վիճակ' }, { title: 'Արտադրող' },
    { title: 'Թողարկման տարեթիվ N' }, { title: 'Գործարանային համար' },
    { title: 'Տեշնիկական անձնագիր' }, { title: 'Մակնիշ' },
    { title: 'Համառոտ բնութագիր' },
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
      this._getFixedAssetsCount(),
      this._getFixedAssets(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
  }
  private _checkParams(): void {
    this._resetProperties()
    this._activatedRoute.queryParams.subscribe((queryparams) => {
      if (queryparams && queryparams.page) {
        this._page = +queryparams.page;
      }
      // this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
    })

  }
  private _getFixedAssetsCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.fixedAssetsMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }
  private _getFixedAssets(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.fixedAssetsMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.fixedAssets = data.data;
        return data
      })
    )
  }
  public addFixedAssets(isNew: boolean, id?: number): void {
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
  private _openModal(isNew: boolean, id?: number): void {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AcquisitionOperationCalculatorsModal, {
      width: '80vw',
      minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._urls.fixedAssetsGetOneUrl, id: id }
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
    this._mainService.deleteByUrl(this._urls.fixedAssetsGetOneUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.fixedAssets, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    })
  }
  ngOnDestroy() {
    this._loadingService.hideLoading()
    // this._subscription.unsubscribe()
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
  // constructor(private _matDialog: MatDialog, private _title: Title) {
  //   this._title.setTitle('Հիմնական միջոցներ')
  // }
  // ngOnInit() { }
  // public addUnit() {
  //   this.openModal()
  // }
  // public openModal() {
  //   this._matDialog.open(AccountsTabComponent, {
  //     width: '500px'
  //   })
  // }

}

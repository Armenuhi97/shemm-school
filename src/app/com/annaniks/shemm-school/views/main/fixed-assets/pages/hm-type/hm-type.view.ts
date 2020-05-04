import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount, HmTypeDetail } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { AddHmTypeModal } from '../add-hm-type/add-hm-type.modal';

@Component({
  selector: 'app-hm-type',
  templateUrl: './hm-type.view.html',
  styleUrls: ['./hm-type.view.scss']
})
export class HmTypeView implements OnInit {
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'ՀՄ տեսակ';
  public hmTypes: HmTypeDetail[] = [];
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles = [
    { title: 'Կոդ' },
    { title: 'Անվանում' },
    { title: 'Սկզբնական արժեքի հաշիվ' },
    { title: 'Մաշվածության հաշիվ' },
    { title: 'Օգտակար ծառայության ժամկետ (ամիս)' },
    { title: 'ՀՄ խումբ շահութահարկի օրենքով' },
    { title: 'Կուտակիչ' }
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
      this._getHmTypesCount(),
      this._getHmTypes(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
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


  private _getHmTypesCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.hmTypesMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }


  public onPageChange($event): void {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }
  private _resetProperties(): void {
    this._page = 1;
  }
  private _getHmTypes(limit: number, offset: number): Observable<ServerResponse<HmTypeDetail[]>> {
    return this._mainService.getByUrl(this._urls.hmTypesMainUrl, limit, offset).pipe(
      map((data: ServerResponse<HmTypeDetail[]>) => {
        this.hmTypes = data.data;
        return data
      })
    )
  }

  public lastPage($event: number): void {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  public addHmType(isNew?: boolean, id?: number, item?): void {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew: boolean, id?: number, item?): void {
    let url = 'add-hm-type';
    console.log(isNew);
    console.log(id);

    let path = !isNew ? url : url + `/${id}`
    window.open(`http://localhost:4200/fixed-assets/${path}`, '_blank', 'height=700,width=800')

    // let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    // let dialog = this._matDialog.open(AddHmTypeModal, {
    //   width: '750px',
    //   maxHeight: '85vh',
    //   data: { title: isNewTitle, url: this._urls.hmTypeGetOneUrl, id: id, item}
    // })
    // dialog.afterClosed().subscribe((data) => {
    //   if (data) {
    //     if (data.value) {
    //       if (data.id) {
    //         this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
    //       } else {
    //         let page = this._appService.getPaginatorLastPage(this._count, this._pageLength, this._paginatorLastPageNumber)
    //         this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
    //         this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
    //       }
    //     }
    //   }
    // })
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._urls.hmTypeGetOneUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.hmTypes, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
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

import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';
import { AddSystemAdditionModal } from '../../modals';
import { SystemAdditionPayload, ServerResponse } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
  selector: 'app-system-addition',
  templateUrl: './system-addition.view.html',
  styleUrls: ['./system-addition.view.scss']
})
export class SystemAdditionView implements OnInit {

  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Համակարգային հավելում';
  public systemAddition: SystemAdditionPayload[] = [];
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles: Array<{ title: string }> = [{ title: 'Կոդ' },
  { title: 'Անվանում' }, { title: 'Հաշիվ' }, { title: 'Եկամտային հարկը պահվում է' }
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
      this._getSystemAddition()
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
  public addSystemAddition(isNew: boolean, id?: number, item?): void {
    this._openModal(isNew, id, item)
  }

  private _getSystemAddition(): Observable<void> {
    return this._mainService.getInformationByType(this._urls.systemAdditionUrl).pipe(
      map((data: ServerResponse<SystemAdditionPayload[]>) => {
        let obj = data.data;
        if (obj) {
          this.systemAddition = obj.sort((a: SystemAdditionPayload, b: SystemAdditionPayload) => {
            if (a && a.code && b && b.code) {
              if (a.code < b.code)
                return 1;
              if (a.code > b.code)
                return -1;
            }
            return 0;
          })
        }

      })
    )
  }

  private _openModal(isNew: boolean, id?: number, item?): void {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddSystemAdditionModal, {
      width: '50vw',
      // minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._urls.systemAdditionUrl, id, item, systemAddition: this.systemAddition }
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
  public delete(i: number): void {

    this.systemAddition.splice(i, 1);
    this._loadingService.showLoading()
    this._mainService.updateJsonByUrl(this._urls.systemAdditionUrl, this.systemAddition).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.systemAddition, this._page)
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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount, CashRegisterPayload } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { AddCashRegisterModal } from '../../modals';

@Component({
  selector: 'app-cash-registers',
  templateUrl: './cash-registers.component.html',
  styleUrls: ['./cash-registers.component.scss']
})
export class CashRegistersComponent implements OnInit {

  public titles = [
    { title: 'Կոդ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Անվանում', isSort: false, arrow: '', min: false, max: false },
    { title: 'Հաշիվ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Հիմնական', isSort: false, arrow: '', min: false, max: false },
    { title: 'ԴՄՕ-ի հերթական համար', isSort: false, arrow: '', min: false, max: false },
    { title: 'ԴԵՕ-ի հերթական համար', isSort: false, arrow: '', min: false, max: false },
    { title: 'ՀԴՄ գրանցում', isSort: false, arrow: '', min: false, max: false },
    { title: 'IP հասցե', isSort: false, arrow: '', min: false, max: false },
    { title: 'Պորտ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Գաղտնաբառ', isSort: false, arrow: '', min: false, max: false },
    { title: 'ԱԱՀ-ով հարկվող ՀԴՄ բաժին', isSort: false, arrow: '', min: false, max: false },
    { title: 'ԱԱՀ-ով չհարկվող ՀԴՄ բաժին', isSort: false, arrow: '', min: false, max: false },
    { title: 'ՀԴՄ տպման ռեժիմ', isSort: false, arrow: '', min: false, max: false }
  ];

  public cashRegisters: CashRegisterPayload[] = [];
  private _modalTitle: string = 'Դրամարկղ';
  private _otherUrl: string = 'cash-registers';
  private _cashRegisterUrl = 'cash-register';
  private _paginatorLastPageNumber: number = 0;
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;

  constructor(
    private _matDialog: MatDialog,
    private _title: Title,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appService: AppService,
    private _loadingService: LoadingService,
    private _mainService: MainService
  ) {
    this._title.setTitle(this._modalTitle);

  }

  ngOnInit(): void {
    this._checkParams()
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
    this._page = 1;
  }

  public addCashRegister(isNew?: boolean, id?: number, item?: CashRegisterPayload) {
    this.openModal(isNew, id, item);
  }

  public openModal(isNew: boolean, id?: number, item?) {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddCashRegisterModal, {
      width: '50vw',
      maxHeight: '85vh',
      autoFocus:false,
      data: { title: isNewTitle, url: this._cashRegisterUrl, id: id, item: item }
    })
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        if (data.value) {
          if (data.id) {
            this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength);
          } else {
            let page = this._appService.getPaginatorLastPage(this._count, this._pageLength, this._paginatorLastPageNumber);
            this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, });
            this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
          }
        }
      }
    })
  }

  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getCashRegistersCount(),
      this._getRegisters(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading());
  }

  private _getCashRegistersCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._otherUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _getRegisters(limit: number, offset: number): Observable<ServerResponse<CashRegisterPayload[]>> {
    return this._mainService.getByUrl(this._otherUrl, limit, offset).pipe(
      map((data: ServerResponse<CashRegisterPayload[]>) => {
        this.cashRegisters = data.data;
        return data
      })
    )
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._cashRegisterUrl, id).subscribe(() => {
      let page = this._appService.setAfterDeletedPage(this.cashRegisters, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  public getBooleanVariable(variable: number): boolean {
    return this._appService.getBooleanVariable(variable)
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

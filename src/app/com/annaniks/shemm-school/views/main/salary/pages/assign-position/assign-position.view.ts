import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main.service';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { ServerResponse, DataCount, Employees } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map, switchMap } from 'rxjs/operators';
import { AddAssignPositionModal } from '../../modals';

@Component({
  selector: 'app-assign-position',
  templateUrl: './assign-position.view.html',
  styleUrls: ['./assign-position.view.scss']
})
export class AssignPositionView implements OnInit {

  public titles = [
    { title: 'Հավելում' },
    { title: 'Գործակից' },
    { title: 'Ստորաբաժանում' },
    { title: 'Գումար' }
  ];
  public assignPosition = [];
  public allEmployees: Employees[] = [];
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Նշանակել հաստիքը'
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription;
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
  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getAssignPositionCount(),
      this._getAssignPosition(limit, offset),
      this._getEmployeesCount()
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading()
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


  private _getEmployeesCount(): Observable<void> {
    return this._mainService.getCount(this._urls.employeeMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getAllEmployees(data.data.count)
      })
    )
  }
  private _getAllEmployees(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
      map((data: ServerResponse<Employees[]>) => {
        this.allEmployees = data.data;
      })
    )
  }
  private _getAssignPositionCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.assignEstablishmentsMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _getAssignPosition(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.assignEstablishmentsMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.assignPosition = data.data;
        return data
      })
    )
  }

  public addAssignPosition(isNew?: boolean, id?: number, item?): void {
    this.openModal(isNew, id, item)
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
  public openModal(isNew?: boolean, id?: number, item?): void {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddAssignPositionModal, {
      width: '800px',
      minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._urls.additionGetOneUrl, id: id, item, assignEstablishmentsMain: this.assignPosition, employees: this.allEmployees }
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
    this._mainService.deleteByUrl(this._urls.additionGetOneUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.addAssignPosition, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => { this._loadingService.hideLoading() }
    )
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

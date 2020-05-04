import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMeasurmentModal } from '../../modals';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { UnitOfMeasurementService } from './unit-of-measurement.service';
import { map } from 'rxjs/operators';
import { IMeasurementUnitPayload, DataCount, ServerResponse } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss']
})
export class UnitOfMeasurementComponent implements OnInit, OnDestroy {
  private _url: string = 'measurement-units';
  private _otherUrl = 'measurement-unit';
  private _paginatorLastPageNumber: number = 0;
  private _modalTitle: string = 'Չափման միավոր';
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  public unitOfMeasurements: IMeasurementUnitPayload[] = [];
  public titles = [
    { title: 'Կոդ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Անվանում', isSort: false, arrow: '', min: false, max: false },
    { title: 'Հապավում', isSort: false, arrow: '', min: false, max: false }
  ];

  constructor(private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _loadingService: LoadingService,
    private _unitOfMeasurementService: UnitOfMeasurementService,
    private _appService: AppService,
  ) {
    this._title.setTitle(this._modalTitle)
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
  public addUnitOfMeasurement(isNew?: boolean, id?: number, item?): void {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew?: boolean, id?: number, item?: IMeasurementUnitPayload): void {
    let dialog = this._matDialog.open(AddMeasurmentModal, {
      width: '500px',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: this._modalTitle, url: this._otherUrl, id: id, item }
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

  private _getMeasurementsPlan(limit: number, offset: number): Observable<ServerResponse<IMeasurementUnitPayload[]>> {
    return this._unitOfMeasurementService.getMeasurement(limit, offset).pipe(
      map((data: ServerResponse<IMeasurementUnitPayload[]>) => {
        this.unitOfMeasurements = data.data
        return data
      })
    )
  }

  private _getMeasurementsPlanCount(): Observable<ServerResponse<DataCount>> {
    return this._unitOfMeasurementService.getMeasurementsCount().pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count
        return data
      })
    )
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
    this._page = 1
  }

  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getMeasurementsPlanCount(),
      this._getMeasurementsPlan(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._unitOfMeasurementService.deleteMeasurement(id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.unitOfMeasurements, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
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

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

}

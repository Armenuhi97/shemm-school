import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddServiceModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { ServicesService } from './services.service';
import { ServerResponse, DataCount, ServicesDetail } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'services-view',
  templateUrl: 'services.view.html',
  styleUrls: ['services.view.scss']
})
export class ServicesView {
  public titles = [
    {
      title: 'Կոդ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Անվանում',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Լրիվ անվանում',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Չափման միավոր',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'ԱԴԳՏ դասակարգիչ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Հաշիվ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Մեծածախ գին դրամով',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Մանրածախ գին դրամով',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Գծիկվոր կոդ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'ԱԱՀ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    }


  ]
  private _modalTitle: string = 'Ծառայություններ';
  private _otherUrl: string = 'service';
  private _paginatorLastPageNumber: number = 0;
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  public servicesValue: ServicesDetail[] = [];
  private _serviceUrl: string = 'services'


  constructor(private _matDialog: MatDialog,
    private _title: Title,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _appService: AppService,
    private _servicesService: ServicesService,
    private _mainService: MainService,
    private _loadingService: LoadingService,
  ) {
    this._title.setTitle('Ծառայություններ')
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
    this._page = 1
  }

  public addServices(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew?: boolean, id?: number, item?: any) {
    let dialog = this._matDialog.open(AddServiceModal, {
      width: '850px',
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


  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this.getServiceValuesCount(),
      this.getServiceValues(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  public getServiceValuesCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._serviceUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  public getServiceValues(limit: number, offset: number): Observable<ServerResponse<Object>> {
    return this._mainService.getByUrl(this._serviceUrl, limit, offset).pipe(
      map((data: any) => {
        this.servicesValue = data.data;
        return data
      })
    )
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._servicesService.deleteService(id).subscribe(() => {
      let page = this._appService.setAfterDeletedPage(this.servicesValue, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  public getBooleanVariable(variable: number) {
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
import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddMaterialValueModal, ClassificationModal } from '../../modals';
import { UnitOfMeasurementService } from '../../../main-accounting/pages/unit-of-measurement/unit-of-measurement.service';
import { Observable, from, forkJoin, Subscription } from 'rxjs';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MaterialValuesService } from './material-values.service';
import { MainService } from '../../../main.service';

@Component({
  selector: 'material-values-view',
  templateUrl: 'material-values.view.html',
  styleUrls: ['material-values.view.scss']
})
export class MaterialValuesView implements OnInit {
  public titles = [
    {
      title: 'Անվանում',
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
      title: 'Խումբ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'ԱՏԳԱԱ դասակարգիչ',
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
      title: 'Վաճառքից հասույթի հաշիվ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Մանրածախ վաճառքից հասույթի հաշիվ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Բնութագիր',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Գծիկավոր կոդ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },
    {
      title: 'Արտաքին կոդ',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    },

    {
      title: 'ՀԾԲ գործակից',
      isSort: false,
      arrow: '',
      min: false,
      max: false
    }
    //,
    // {
    //   title: 'Հաշվառման մեթոդ',
    //   isSort: false,
    //   arrow: '',
    //   min: false,
    //   max: false
    // },
    // {
    //   title: 'ԱԱՀ',
    //   isSort: false,
    //   arrow: '',
    //   min: false,
    //   max: false
    // }

  ];

  public materialValues = [];

  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _paginatorLastPageNumber: number = 0;

  public _materialValuesCount: number = 0
  private _materialValueUrl = 'material-values';
  private _modalTitle: string = 'Նյութական արժեք';
  private _subscription: Subscription;

  constructor(private _matDialog: MatDialog,
    private _materialValuesService: MaterialValuesService,
    private _mainService: MainService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _title: Title,
    private _loadingService: LoadingService,
    private _appService: AppService
  ) {
    this._title.setTitle(this._modalTitle)
   }

  ngOnInit() {
    this._checkParams();
  }

  public addMaterialValues(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item);
  }

  public openModal(isNew?: boolean, id?: number, item?) {

    let dialog = this._matDialog.open(ClassificationModal, {
      width: '80vw',
      minHeight: '55vh',
      maxHeight: '85vh',
      data: {
        url: 'material-value',
        id: id,
        item: item
      }
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

  private _checkParams() {
    this._resetProperties();
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams && queryParams.page) {
        this._page = +queryParams.page;
      }
      this._combineObservable(this._pageLength, (this._page - 1) * this._pageLength)
    })
  }


  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this.getMaterialValuesCount(),
      this.getMaterialValues(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._materialValuesService.deleteMaterialValue(id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.materialValues, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  public getMaterialValuesCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._materialValueUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  public getMaterialValues(limit: number, offset: number): Observable<ServerResponse<any>> {
    return this._mainService.getByUrl(this._materialValueUrl, limit, offset).pipe(
      map((data: ServerResponse<any>) => {
        this.materialValues = data.data;
        return data
      })
    )
  }

  public getBooleanVariable(variable: number) {
    return this._appService.getBooleanVariable(variable)
  }

  public onPageChange($event) {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }

  private _resetProperties(): void {
    this._page = 1;
  }

  public lastPage($event: number) {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }

  ngOnDestroy() {
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

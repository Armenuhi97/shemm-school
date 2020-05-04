import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { Title } from '@angular/platform-browser';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { AddProvisionsModal } from '../../modals';

@Component({
  selector: 'app-provisions',
  templateUrl: './provisions.view.html',
  styleUrls: ['./provisions.view.scss']
})
export class ProvisionsView implements OnInit {
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Դրույթներ';
  public subdivisionEmployees = [];
  public provisions
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles: Array<{ title: string }> = [
    { title: 'Հաշվարկի ամսաթիվ' }, { title: 'Հաշվարկել աշխատավարձը անմիջապես' }, { title: 'Կլորացման աստիճան' }, { title: 'Տարանցիկ հաշիվ' }, 
    { title: 'Նվազագույն աշխատավարձ' }, { title: 'Նվազագույն աշխատավարձ կուտ․ կենսաթոշակով (մինչև 01/07/17թ․)' }, { title: 'Նվազագույն աշխատավարձ կուտ․ կենսաթոշակով (մինչև 01/07/17թ․-ից)' },
    { title: 'Միջին օրական գործակիցը արձակուրդ հաշվարկելիս' }, { title: 'Ամիսների քանակ միջինի համար' }, { title: 'Միջինի օրական գործակիցը անաշխ․ նպաստ հաշվարկելիս' },
    { title: 'Միջինի օրական գործակիցը մայրության անաշխ․ նպաստ հաշվարկելիս' }, { title: 'Դրոշմանիշային վճարի չափ' }, { title: 'Գործատուի դրոշմանիշային վճարի ծախսի հաշիվ' },
    { title: 'Ներդրման ամսաթիվ' }, { title: 'Կադրային փաստաթղթերի հաշվառում' }
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
      this._getEmployeesCount(),
      this._getEmployees(limit, offset),
      this._getProvisionsSalary()
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

  private _getEmployeesCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._urls.replacementsMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }
  private _getEmployees(limit: number, offset: number): Observable<ServerResponse<any[]>> {
    return this._mainService.getByUrl(this._urls.replacementsMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.subdivisionEmployees = data.data;
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

  public lastPage($event: number): void {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }
  public add(isNew: boolean, id?: number, item?): void {
    this._openModal(isNew, id, item)
  }

  private _getProvisionsSalary() {
    return this._mainService.getInformationByType(this._urls.provisionSalaryUrl).pipe(
      map((data) => {
        this.provisions = data.data;
      })
    )
  }

  private _openModal(isNew: boolean, id?: number, item?): void {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(AddProvisionsModal, {
      width: '80vw',
      minHeight: '55vh',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._urls.replacementGetOwnUrl, id, item, provisions: this.provisions }
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
    this._mainService.deleteByUrl(this._urls.replacementGetOwnUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.subdivisionEmployees, this._page)
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

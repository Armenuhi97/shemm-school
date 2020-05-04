import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';
import { ServerResponse, DataCount, MaterialValueGroupDetail } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MaterialValueGroupModal } from '../../modals';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _modalTitle: string = 'Խումբ';
  private _materialvalueGroupMainUrl: string = 'material-value-groups';
  private _materialvalueGroupOtherUrl: string = 'material-value-group';

  public materialvalueGroups = []
  private _paginatorLastPageNumber: number = 0;
  private _subscription: Subscription
  public titles = [
    { title: 'Կոդ', isSort: false, arrow: '', min: false, max: false },
    { title: 'Անվանում', isSort: false, arrow: '', min: false, max: false },
    { title: 'Խումբ', isSort: false, arrow: '', min: false, max: false },
  ]
  constructor(private _matDialog: MatDialog, private _title: Title, private _loadingService: LoadingService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _mainService: MainService,
    private _messageService: MessageService,
    private _appService: AppService
  ) {
    this._title.setTitle(this._modalTitle)
  }

  ngOnInit() {
    this._checkParams()
  }

  private _combineObservable(limit: number, offset: number) {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getMaterialvalueGroupCount(),
      this._getMaterialvalueGroups(limit, offset)
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

  private _getMaterialvalueGroupCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._materialvalueGroupMainUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  public addMaterialvalueGroup(isNew?: boolean, id?: number, item?) {
    this.openModal(isNew, id, item)
  }

  public onPageChange($event) {
    if ($event.isArrow)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: $event.pageNumber }, })
  }

  private _resetProperties(): void {
    this._page = 1;
  }

  private _getMaterialvalueGroups(limit: number, offset: number) {
    return this._mainService.getByUrl(this._materialvalueGroupMainUrl, limit, offset).pipe(
      map((data: ServerResponse<any[]>) => {
        this.materialvalueGroups = data.data;
        return data
      })
    )
  }

  public lastPage($event: number) {
    if ($event)
      this._paginatorLastPageNumber = $event;
  }


  public openModal(isNew?: boolean, id?: number, item?: MaterialValueGroupDetail) {
    let isNewTitle = isNew ? this._modalTitle : this._modalTitle + ' (Նոր)';
    let dialog = this._matDialog.open(MaterialValueGroupModal, {
      width: '700px',
      maxHeight: '85vh',
      autoFocus: false,
      data: { title: isNewTitle, url: this._materialvalueGroupOtherUrl, id: id, item, array: this.materialvalueGroups }
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

  public getBooleanVariable(variable: number) {
    return this._appService.getBooleanVariable(variable)
  }

  public delete(id: number) {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._materialvalueGroupOtherUrl, id).subscribe((data) => {
      let page = this._appService.setAfterDeletedPage(this.materialvalueGroups, this._page)
      this._router.navigate([], { relativeTo: this._activatedRoute, queryParams: { page: page }, })
      this._combineObservable(this._pageLength, (page - 1) * this._pageLength)
      this._loadingService.hideLoading()
    },
      (err) => {
        this._mainService.translateServerError(err)
        this._loadingService.hideLoading()
      })
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

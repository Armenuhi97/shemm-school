import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AddFormulaModal } from '../../modals';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { Formulas, ServerResponse, DataCount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formula-view',
  templateUrl: 'formula.view.html',
  styleUrls: ['formula.view.scss']
})
export class FormulaView {

  public titles = [
    { title: 'Կոդ', isSort: false, arrow: '', min: false, max: true },
    { title: 'Անվանում', isSort: false, arrow: '', min: false, max: true },
    { title: 'Բանաձև', isSort: false, arrow: '', min: false, max: true }
  ];
  public formulasValues: Formulas[] = [];
  private _modalTitle: string = 'Բանաձևեր';
  private _otherUrl: string = 'formula';
  private _paginatorLastPageNumber: number = 0;
  private _pageLength: number = 10;
  private _count: number = 0;
  private _page: number = 1;
  private _subscription: Subscription;
  private _formulaUrl: string = 'formulas';

  constructor(private _matDialog: MatDialog,
    private _title: Title,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _appService: AppService,
    private _mainService: MainService,
    private _loadingService: LoadingService,
  ) {
    this._title.setTitle('Բանաձևեր')
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

  public addFormula(isNew?: boolean, id?: number, item?): void {
    this.openModal(isNew, id, item)
  }

  public openModal(isNew?: boolean, id?: number, item?: Formulas): void {
    let dialog = this._matDialog.open(AddFormulaModal, {
      width: '50vw',
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

  private _combineObservable(limit: number, offset: number): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getFormulasCount(),
      this._getFormulas(limit, offset)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading(),
      () => this._loadingService.hideLoading())
  }

  private _getFormulasCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._formulaUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._count = data.data.count;
        return data
      })
    )
  }

  private _getFormulas(limit: number, offset: number): Observable<ServerResponse<Formulas[]>> {
    return this._mainService.getByUrl(this._formulaUrl, limit, offset).pipe(
      map((data: ServerResponse<Formulas[]>) => {
        this.formulasValues = data.data;
        return data
      })
    )
  }

  public delete(id: number): void {
    this._loadingService.showLoading()
    this._mainService.deleteByUrl(this._otherUrl, id).subscribe(() => {
      let page = this._appService.setAfterDeletedPage(this.formulasValues, this._page)
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

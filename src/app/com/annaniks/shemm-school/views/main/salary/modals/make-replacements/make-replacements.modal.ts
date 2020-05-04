import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, DataCount, Employees, ReplacementPayload } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-make-replacements',
  templateUrl: './make-replacements.modal.html',
  styleUrls: ['./make-replacements.modal.scss']
})
export class MakeReplacementsModal implements OnInit {

  public replacementGroup: FormGroup;
  public title = '';
  public employees: Employees[] = [];
  private _error = '';
  private _subscription: Subscription;
  constructor(private _dialogRef: MatDialogRef<MakeReplacementsModal>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    @Inject('URL_NAMES') private _urls) {
    this.title = this._data.title;
  }

  ngOnInit() {
    this._validate();
    this._checkMatDialogData()
  }

  private _checkMatDialogData() {
    if (this._data && this._data.item) {
      const { date, hours, substitute, replaceable,beAbsence } = this._data.item;      
      this.replacementGroup.setValue({
        date: new Date(date),
        hours,
        beAbsence,
        substituteId: substitute,
        replaceableId: replaceable
      })
    }
  }

  private _validate() {
    this.replacementGroup = this._fb.group({
      date: [this.setTodayDate(), Validators.required],
      hours: [null, Validators.required],
      substituteId: [null, Validators.required],
      replaceableId: [null, Validators.required],
      beAbsence:[false]
    })
    this._combineObservable()
  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getEmployeesCount()
    )
    this._subscription = combine.subscribe((data) => {

      this._loadingService.hideLoading()
    })
  }

  private _getEmployeesCount(): Observable<void> {
    return this._mainService.getCount(this._urls.employeeMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getEmployees(data.data.count)
      })
    )
  }
  private _getEmployees(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
      map((data: ServerResponse<Employees[]>) => {
        this.employees = data.data;
      })
    )
  }

  public close() {
    this._dialogRef.close()
  }

  public setTodayDate(): Date {
    let today = new Date();
    return today
  }

  public setValue(event, controlName: string): void {
    this.replacementGroup.get(controlName).setValue(event);

  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.replacementGroup, controlName, property)
  }


  public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
    let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
    return modalParams
  }

  public makeReplacement() {
    let sendingReplacementForm: ReplacementPayload = {
      date: this._datePipe.transform(this.replacementGroup.get('date').value, 'yyyy-MM-dd'),
      hours: this.replacementGroup.get('hours').value,
      substituteId: this._appService.checkProperty(this.replacementGroup.get('substituteId').value,'id'),
      replaceableId: this._appService.checkProperty(this.replacementGroup.get('replaceableId').value,'id'),
      beAbsence: this._appService.getBooleanVariable(this.replacementGroup.get('beAbsence').value)
    }

    if (this.replacementGroup.valid) {
      this._loadingService.showLoading()
      if (!this._data.id) {
        this._mainService.addByUrl(this._data.url, sendingReplacementForm).subscribe((data) => {
          this._dialogRef.close({ value: true })
          this._loadingService.hideLoading()
        }, (err) => {
          this._mainService.translateServerError(err)
          this._loadingService.hideLoading()
        })
      } else {
        this._mainService.updateByUrl(this._data.url, this._data.id, sendingReplacementForm).subscribe(() => {
          this._dialogRef.close({ value: true, id: this._data.id });
          this._loadingService.hideLoading()
        }, (err) => {
          this._mainService.translateServerError(err)
          this._loadingService.hideLoading()
        })
      }
    }
  }

  get error(): string {
    return this._error
  }

  ngOnDestroy() {
    this._loadingService.hideLoading()
    this._subscription.unsubscribe();
  }

}

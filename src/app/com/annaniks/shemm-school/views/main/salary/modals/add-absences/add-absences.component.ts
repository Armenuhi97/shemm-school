import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { switchMap, map } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';

import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount, AbsencesPayload } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
  selector: 'app-add-absences',
  templateUrl: './add-absences.component.html',
  styleUrls: ['./add-absences.component.scss']
})
export class AddAbsencesComponent implements OnInit {

  public absentGroup: FormGroup;
  public title: string;
  public employees: AbsencesPayload[] = []
  public serverResponseError = '';

  private _subscription: Subscription;

  constructor(
    private _dialogRef: MatDialogRef<AddAbsencesComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _datePipe: DatePipe,
    @Inject('URL_NAMES') private _urls

  ) {
    this.title = this._data.title;
    this._validate();
    this._checkMatdialogDate()
  }

  private _checkMatdialogDate(): void {
    console.log(this._data)
    if (this._data.item) {
      this.absentGroup.patchValue({
        employeeId: this._data.item.employee,
        date: new Date(this._data.item.date)
      })
    }
  }



  private _validate() {
    this.absentGroup = this._fb.group({
      employeeId: [null, Validators.required],
      date: [this.setTodayDate(), Validators.required]
    })
    this._combineObservable()
  }

  ngOnInit() {

  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getCount()
    )
    this._subscription = combine.subscribe((data) => {
      this._loadingService.hideLoading()
    })
  }

  public setTodayDate(): Date {
    let today = new Date();
    return today
  }

  private _getCount(): Observable<void> {
    return this._mainService.getCount(this._urls.employeeMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        let count = data.data.count;
        return this._getEmployees(count)
      })
    )
  }
  private _getEmployees(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
      map((data: ServerResponse<AbsencesPayload[]>) => {
        this.employees = data.data;
      })
    )
  }

  public close() {
    this._dialogRef.close()
  }

  public setValue(event, controlName: string): void {
    if (event)
    this.absentGroup.get(controlName).setValue(event);
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.absentGroup, controlName, property)
  }

  public setModalParams(title: string) {
    let modalParams = { tabs: ['Անուն'], title: title, keys: ['fullName'] };
    return modalParams
  }

  public addAbsent() {
    this._loadingService.showLoading()
    let sendingData: AbsencesPayload = {
      date: this._datePipe.transform(new Date(this.absentGroup.get('date').value), 'yyyy-MM-dd'),
      employeeId: this._appService.checkProperty(this.absentGroup.get('employeeId').value, "id")
    }
    console.log(sendingData)

    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._urls.absenceGetOneUrl}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    } else {
      this._mainService.addByUrl(`${this._urls.absenceGetOneUrl}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    }
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

}


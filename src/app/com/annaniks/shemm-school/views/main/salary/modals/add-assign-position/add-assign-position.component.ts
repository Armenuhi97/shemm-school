import { Component, OnInit, Inject } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ServerResponse, DataCount, ShortModel, Addition, Employees } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-assign-position',
  templateUrl: './add-assign-position.component.html',
  styleUrls: ['./add-assign-position.component.scss']
})
export class AddAssignPositionModal implements OnInit {
  public assignPositionGroup: FormGroup;
  public title: string;
  public employees: any[] = [];
  public _subdivisions = []
  public additions = [];
  public serverResponseError = '';
  public assignEstablishmentListOfEmployee: FormArray;
  public totalAmount: number = 0;
  public isFocus: boolean = false;
  public subdivisions = [];
  private _subscription: Subscription;
  public employeesBySubdivisionId = 'employeesBySubdivision';
  public selectedEmployeeId: number
  constructor(private _dialogRef: MatDialogRef<AddAssignPositionModal>,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    @Inject(MAT_DIALOG_DATA) private _data,
    @Inject('URL_NAMES') private _urls,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _datePipe: DatePipe,
    private _appService: AppService,
    private _fb: FormBuilder) {
    this.title = this._data.title;
    this._validate()
  }


  ngOnInit() {
    this.title = this._data.title;
    this._validate();
  }


  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getSubdivisionCount(),
      this._getAdditionsCount(),
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
        this.employees = data.data
      })
    )
  }

  private _getEmployeesBySubdivisions(url: string, id: number) {
    this._loadingService.showLoading()
    this._mainService.getById(url, id).pipe(
      map((data: ServerResponse<any[]>) => {
        let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
        let employeesArray = data.data
        if (formArray && formArray.length) {          
          formArray.controls.forEach((val) => {
            data.data.forEach((element, index) => {
              if (val.value.employeeId.id == element.id) {
                employeesArray.splice(index, 1)
              }
            })
          })
        }
        employeesArray.forEach(element => {
          formArray.push(this._fb.group({
            subdivisionId: [element.subdivisionId, Validators.required],
            employeeId: element,
            money: null,
            isMain: [false],
            date: this.setTodayDate()
          }))
        })
        this._loadingService.hideLoading()        

      })
    ).subscribe()
  }
  private _getSubdivisionCount(): Observable<void> {
    return this._mainService.getCount(this._urls.subdivisionMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getSubdivisions(data.data.count)
      })
    )
  }
  private _getSubdivisions(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.subdivisionMainUrl, count, 0).pipe(
      map((data: ServerResponse<ShortModel[]>) => {
        this.subdivisions = data.data;
      })
    )
  }

  private _getAdditionsCount(): Observable<void> {
    return this._mainService.getCount(this._urls.additionMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getAdditions(data.data.count)
      })
    )
  }
  private _getAdditions(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.additionMainUrl, count, 0).pipe(
      map((data: ServerResponse<Addition[]>) => {
        this.additions = data.data;
      })
    )
  }

  public close(): void {
    this._dialogRef.close()
  }


  private _validate(): void {
    this.assignPositionGroup = this._fb.group({
      date: [this.setTodayDate(), Validators.required],
      additionId: [null, Validators.required],
      subdivisionId: [null],
      totalSalary: [null],
      assignEstablishmentListOfEmployee: this._fb.array([
        this._fb.group({
          subdivisionId: [null, Validators.required],
          employeeId: [null],
          money: [null, Validators.required],
          isMain: [false],
          date: this._datePipe.transform(new Date(this.setTodayDate()), 'dd/MM/yyyy')
        })
      ])
    })
    this.assignPositionGroup.get('subdivisionId').valueChanges.subscribe((value) => {
      const formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
    })
    this.removeFirst();
    this._combineObservable();
  }

  public addAssigneEstablishmentOfEmployeeGroup() {
    return this._fb.group({

    })
  }

  public removeFirst() {
    let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
    this.remove(0)

  }

  public setTodayDate(): Date {
    let today = new Date();
    return today
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }

  public addRow(event: boolean) {
    if (event) {
      let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
      if (formArray && formArray.length && formArray.length == this.employees.length) {
        return
      }
      formArray.push(this._fb.group({
        subdivisionId: [null],
        employeeId: [null],
        money: [null, Validators.required],
        isMain: [false],
        date: this.setTodayDate()
      }))

    }
  }

  public remove(index: number): void {
    let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray
    formArray.removeAt(index);
    this.changeAmount()
  }

  public deleteAll(event: boolean): void {
    let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray
    if (event && (formArray && formArray.length)) {
      let index = formArray.length - 1;
      formArray.removeAt(index);
      this.changeAmount();
    }
  }

  public changeAmount() {
    let sum: number = 0;
    let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;

    if (formArray && formArray.controls) {
      for (let item of formArray.controls) {
        if (item.get('money').value) {
          sum += (item.get('money').value) ? +item.get('money').value : 0
        }
      }
    }
    this.assignPositionGroup.get('totalSalary').setValue(sum);
  }



  public setValue(event, controlName: string, form: FormGroup, isSubdivision?: boolean): void {

    if (isSubdivision && event && event.id) {
      this._getEmployeesBySubdivisions(this.employeesBySubdivisionId, event.id)
    }
    let count = 0
    if (event && controlName == 'employeeId') {
      let formArray = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
      formArray.controls.forEach((data) => {
        if (data.value.employeeId) {
          if (data.value.employeeId.id == event.id) {
            count++
          }
        }
      })
    }
    if (count) {
      return
    }
    form.get(controlName).setValue(event);

    if (event && controlName == 'employeeId') {
      let subdivisionId = event.subdivisionId;
      form.get('subdivisionId').setValue(subdivisionId)
    }
    this.onFocus(form, controlName);
  }

  public setInputValue(controlName: string, property: string, form: FormGroup = this.assignPositionGroup) {
    return this._appService.setInputValue(form, controlName, property)
  }

  public setModalParams(title: string, keys: string[]) {
    let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: keys };
    return modalParams
  }



  public addAssignPositions() {
    let assignEstablishmentListOfEmployeeFormArray = [];
    const selectedValues = this.assignPositionGroup.get('assignEstablishmentListOfEmployee') as FormArray;
    const assignEstablishmentListOfEmployee = selectedValues.controls.forEach((element, index) => {
      let value=element.value      
      console.log(value);
      
      assignEstablishmentListOfEmployeeFormArray.push({
        subdivisionId: +value.subdivisionId,
        employeeId: this._appService.checkProperty(value.employeeId, 'id'),
        money: value.money,
        isMain: false,
        date: value.date ? this._datePipe.transform(value.date, 'yyyy-MM-dd') : this.setTodayDate()
      })
    })
    let sendingData = {
      date: this._datePipe.transform(this.assignPositionGroup.get('date').value, 'yyyy-MM-dd'),
      additionId: this._appService.checkProperty(this.assignPositionGroup.get('additionId').value,'id'),
      subdivisionId: this._appService.checkProperty(this.assignPositionGroup.get('subdivisionId').value,'id'),
      totalSalary: this.assignPositionGroup.get('totalSalary').value,
      assignEstablishmentListOfEmployee: assignEstablishmentListOfEmployeeFormArray
    }
    console.log(sendingData);
    

    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._urls.assignEstablishmentGetOneUrl}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    } else {
      this._mainService.addByUrl(`${this._urls.assignEstablishmentGetOneUrl}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    }


  }
  ngOnDestroy() {
    this._loadingService.hideLoading()
  }
}
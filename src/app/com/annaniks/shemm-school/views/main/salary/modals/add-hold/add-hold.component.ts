import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription } from 'rxjs';
import { MainService } from '../../../main.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-hold',
  templateUrl: './add-hold.component.html',
  styleUrls: ['./add-hold.component.scss']
})
export class AddHoldComponent implements OnInit {

  public title: string;
  public holdGroup: FormGroup;
  public chartAccounts = [];
  public serverResponseError: string = '';
  public types: any
  private _subscription: Subscription;
  constructor(
    private _dialogRef: MatDialogRef<AddHoldComponent>,
    @Inject(MAT_DIALOG_DATA) private _data,
    @Inject('URL_NAMES') private _urls,
    private _mainService: MainService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _fb: FormBuilder) {
    this.title = this._data.title
  }
  ngOnInit() {
    this._validate();
    this._checkMatdialogDate()
  }

  private _checkMatdialogDate(): void {
    if (this._data.item) {
    
      this.holdGroup.patchValue({
        code: this._data.item.code,
        name: this._data.item.name,
        coefficient: this._data.item.coefficient,
        reduceFromIncomeTaxMoney: (typeof this._data.item.reduceFromIncomeTaxMoney === 'number') ? this.getBooleanVariable(this._data.item.reduceFromIncomeTaxMoney) : this._data.item.reduceFromIncomeTaxMoney,
        reduceFromMandatoryFundPens: (typeof this._data.item.reduceFromMandatoryFundPens === 'number') ? this.getBooleanVariable(this._data.item.reduceFromMandatoryFundPens) : this._data.item.reduceFromMandatoryFundPens,
        inTheMiddleOfVacation: this._data.item.inTheMiddleOfVacation,
        accountId: this._data.item.account
      })
    }
  }

  private _validate(): void {
    this.holdGroup = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      coefficient: [null],
      reduceFromIncomeTaxMoney: [false],
      reduceFromMandatoryFundPens: [false],
      inTheMiddleOfVacation: [null, Validators.required],
      accountId: [null]
    })
    this._combineObservable()
  }

  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
      this._getTypes()
    )
    this._subscription = combine.subscribe((data) => {
      if (data) {
        this.chartAccounts = this._oftenUsedParams.getChartAccounts();
        this._loadingService.hideLoading()
      }
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  private _getTypes() {
    return this._mainService.getInformationByType('information-by-type/inTheMiddleOfVacation').pipe(
      map((data) => {
        this.types = data.data
      })
    )
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }

  public addHold() {
    this._loadingService.showLoading()
    const sendingData = {
      code: this.holdGroup.get('code').value,
      name: this.holdGroup.get('name').value,
      coefficient: +this.holdGroup.get('coefficient').value,
      reduceFromIncomeTaxMoney: this.holdGroup.get('reduceFromIncomeTaxMoney').value,
      reduceFromMandatoryFundPens: this.holdGroup.get('reduceFromMandatoryFundPens').value,
      inTheMiddleOfVacation: this.holdGroup.get('inTheMiddleOfVacation').value,
      accountId: this._appService.checkProperty(this.holdGroup.get('accountId').value, 'id')
    }
    console.log(sendingData)
    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._urls.holdGetOneUrl}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    } else {
      this._mainService.addByUrl(`${this._urls.holdGetOneUrl}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    }
  }

  public close() {
    this._dialogRef.close()
  }

  public getBooleanVariable(variable: number): boolean {
    return this._appService.getBooleanVariable(variable)
  }

  public setValueName(event, controlName: string, form: FormGroup = this.holdGroup) {
    console.log(event, controlName, form)
    form.get(controlName).setValue(event.name)
  }

  public setValue(event, controlName: string, form: FormGroup = this.holdGroup) {
    form.get(controlName).setValue(event);
    this.onFocus(this.holdGroup, controlName)
  }

  public setModalParams(title: string, codeKeyName: string) {
    let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
    return modalParams
  }
  public setInputValue(controlName: string, property: string, form = this.holdGroup) {
    return this._appService.setInputValue(form, controlName, property)
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}

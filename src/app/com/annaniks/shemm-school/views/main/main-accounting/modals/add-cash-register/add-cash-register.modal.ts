import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { ServerResponse, DataCount, CashRegisterPayload, AccountPlans, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  selector: 'app-add-cash-register',
  templateUrl: './add-cash-register.modal.html',
  styleUrls: ['./add-cash-register.modal.scss']
})
export class AddCashRegisterModal implements OnInit, OnDestroy {

  public formCashRegister: FormGroup;
  public serverResponseError = '';
  public accontPlans = [];
  private _subscription: Subscription;
  public title = 'Դրամարկղ (Նոր)';
  private _accuntPlansUrl = 'account-plans';
  private _accontPlansCount = 10;
  public modalParamsAccountPlans = { tabs: ['Հաշիվ', 'Անվանում'], title: 'Դրամարկղի հաշիվ', keys: [ 'account', 'name'] }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { title?: string, id?: number, url?: string, item?: CashRegisterPayload },
    private _dialogRef: MatDialogRef<AddCashRegisterModal>,
    private _mainService: MainService,
    private _appService: AppService,
    private _loadingService: LoadingService,
    private _fb: FormBuilder) { }


  ngOnInit() {
    this._validate();
    this._checkMatDialogData()
  }

  public close() {
    this._dialogRef.close()
  }

  private _checkMatDialogData(): void {
    if (this._data.item) {
      const { code,
        name,
        accountId,
        isMain,
        dmoN,
        deoN,
        hdmRegisN,
        ip,
        port,
        password,
        hdmNonTaxable,
        hdmTaxable,
        hdmPrintType } = this._data.item;

      this.formCashRegister.patchValue({
        code, name, accountId,
        isMain: (typeof isMain === 'number') ? this.getBooleanVariable(isMain) : isMain,
        dmoN, deoN, hdmRegisN, ip, port, password, hdmNonTaxable, hdmTaxable, hdmPrintType
      })
    } else {
      this._generateDocumentNumber()
    }
  }
  private _generateDocumentNumber(): void {
    if (!this._data.id) {
      this._loadingService.showLoading()
      this._mainService.generateField('cash_register', 'code').subscribe((data: ServerResponse<GenerateType>) => {
        this.formCashRegister.get('code').setValue(data.data.message.maxColumValue);
        this._loadingService.hideLoading()
      }, () => { this._loadingService.hideLoading() })
    } else {
      this._loadingService.hideLoading()
    }
  }
  private _validate(): void {
    this.formCashRegister = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      accountId: [null, Validators.required],
      isMain: [false, Validators.required],
      dmoN: [null, Validators.required],
      deoN: [null, Validators.required],
      hdmRegisN: [null, Validators.required],
      ip: [null, Validators.required],
      port: [null, Validators.required],
      password: [null, Validators.required],
      hdmNonTaxable: [null, Validators.required],
      hdmTaxable: [null, Validators.required],
      hdmPrintType: [null, Validators.required]
    })
    this._combineObservable()
  }

  private _getAcountPlans(limit: number, offset: number): Observable<ServerResponse<AccountPlans[]>> {
    return this._mainService.getByUrl(this._accuntPlansUrl, limit, offset).pipe(
      map((data: ServerResponse<AccountPlans[]>) => {
        this.accontPlans = data.data
        return data
      })
    )
  }

  private _getAccontPlansCount(): Observable<ServerResponse<DataCount>> {
    return this._mainService.getCount(this._accuntPlansUrl).pipe(
      map((data: ServerResponse<DataCount>) => {
        this._accontPlansCount = data.data.count;
        this._getAcountPlans(this._accontPlansCount, 0).subscribe()
        return data
      })
    )
  }

  private _combineObservable(): void {
    const combine = forkJoin(
      this._getAccontPlansCount()
    )
    this._subscription = combine.subscribe()
  }

  public addCashRegister(): void {
    let sendingData: CashRegisterPayload = this.formCashRegister.value;
    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    } else {
      this._mainService.addByUrl(`${this._data.url}`, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.serverResponseError = error.error.data[0].message;
          }
        )
    }
  }

  public getBooleanVariable(variable: number): boolean {
    return this._appService.getBooleanVariable(variable)
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.formCashRegister, controlName, property)
  }

  public setValue(event, controlName?): void {
    this.formCashRegister.get(controlName).setValue(event);
  }

  public setValueAccount(event, controlName?): void {
    this.formCashRegister.get(controlName).setValue(event.account)
  }


  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe()
    }
  }

}

import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { AppService, ComponentDataService, OftenUsedParamsService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription } from 'rxjs';
import { AnalyticalGroup, AccountPlans, Partner, TabItem, WearAdvertisingServices } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';

@Component({
  selector: 'app-wear-calculation',
  templateUrl: 'wear-calulation.modal.html',
  styleUrls: ['wear-calulation.modal.scss']
})
export class CalculationOfWearModal implements OnInit, OnDestroy {
  public wearCalculationForm: FormGroup;
  private _error: string;
  public chartAccounts: AccountPlans[] = [];
  public tabsItem: TabItem[] = [{ title: 'Գույքահամարներ', key: 'advertisingServices', isValid: true },
  { title: 'Գործառնություններ', key: 'operation', isValid: true }];
  public analyticGroup1: AnalyticalGroup[] = [];
  public analyticGroup2: AnalyticalGroup[] = [];
  public title: string;
  private _activeTab: string;
  private _subscription: Subscription
  private _subscription1: Subscription;
  private _lastProductArray: WearAdvertisingServices[] = [];
  private _products: WearAdvertisingServices[] = [];
  public analyticalGroup1: AnalyticalGroup[] = [];
  public analyticalGroup2: AnalyticalGroup[] = []
  public partners: Partner[] = [];
  private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
  private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
  constructor(
    private _loadingService: LoadingService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<CalculationOfWearModal>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    @Inject('URL_NAMES') private _urls,
    private _mainService: MainService,
    private _appService: AppService,
    private _componentDataService: ComponentDataService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _datePipe: DatePipe,
    private _messageService: MessageService,

  ) {
    this.title = this._data.title
    this._validate()
  }

  ngOnInit() {
    this._setDataFromTabs()
  }

  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getPartnerCount(),
      this._mainService.getAccountsPlan(),
      this._mainService.getAnalyticGroupCount(this._group1),
      this._mainService.getAnalyticGroupCount(this._group2),
    )
    this._subscription = combine.subscribe(() => {
      this.chartAccounts = this._oftenUsedParams.getChartAccounts()
      this.partners = this._oftenUsedParams.getPartners();
      this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
      this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2();
      this._loadingService.hideLoading()

    })
  }
  public close(): void {
    this._dialogRef.close()
  }
  private setWearAdvertisingServices(data): WearAdvertisingServices[] {
    let paymentFromCurrentAccount = [];
    if (data && data.length) {
      data.forEach((element) => {
        let object = {
          expenseAccount: this._appService.checkProperty(element.expenseAccount.value, 'id'),
          incomeAccount: this._appService.checkProperty(element.incomeAccount.value, 'id'),
          inventory: element.inventory.value,
          name: element.name.value,
        }
        paymentFromCurrentAccount.push(object)
      })
    }
    return paymentFromCurrentAccount
  }
  private _getOperationArray(body: WearAdvertisingServices[]): void {
    this._mainService.getOperationArray(this._urls.wearFunctionUrl, body, this.wearCalculationForm, this._fb, this.tabsItem)
  }

  private _setDataFromTabs(): void {
    this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
      if (data) {
        if (data.type == 'advertisingServices') {
          if (data.data) {
            let advertisingServices = []
            data.data.forEach((element) => {
              advertisingServices.push(element.controls)
            })
            this._products = [];
            this._products = this.setWearAdvertisingServices(advertisingServices);
            if (!this._appService.checkIsChangeProductArray(this._products, this._lastProductArray)) {
              this._getOperationArray(this._products)
            }
            this._lastProductArray = []
            this._lastProductArray = this.setWearAdvertisingServices(advertisingServices)
          }
        }

        this.wearCalculationForm.get(data.type).setValue(data.data);

        for (let i = 0; i < this.tabsItem.length; i++) {
          if (this.tabsItem[i].key == data.type) {
            this.tabsItem[i].isValid = data.isValid
          }
        }
      }
    })
  }
  public setTodayDate(): Date {
    let today = new Date();
    return today
  }
  private _validate(): void {
    this.wearCalculationForm = this._fb.group({
      date: [this.setTodayDate(), Validators.required],
      orderNumber: [null],
      analyticGroup1: [null],
      analyticGroup2: [null],
      comment: [null],
      advertisingServices: [null],
      operation: [null]
    })
    this._combineObservable()
  }

  public getActiveTab(event: TabItem): void {
    this._activeTab = event.title;
    this._componentDataService.onClick()
  }

  private _checkIsValidTabs(): boolean {
    return this._appService.checkIsValid(this.tabsItem)
  }
  public save(): void {
    this._componentDataService.onClick();
    let operationArray = []
    if (this.wearCalculationForm.get('operation') && this.wearCalculationForm.get('operation').value) {
      this.wearCalculationForm.get('operation').value.forEach((element) => {
        let data = element.value;
        let object = this._appService.getOperationObject(data)
        operationArray.push(object)
      })
    }
    this._appService.markFormGroupTouched(this.wearCalculationForm);

    let sendObject = {
      date: this._datePipe.transform(this.wearCalculationForm.get('date').value, 'yyyy-MM-dd'),
      folderNumber: this.wearCalculationForm.get('orderNumber').value,
      analyticalGroup1Id: this._appService.checkProperty(this.wearCalculationForm.get('analyticGroup1').value, 'id'),
      analyticalGroup2Id: this._appService.checkProperty(this.wearCalculationForm.get('analyticGroup2').value, 'id'),
      comment: this.wearCalculationForm.get('comment').value,
      advertisingServices: this._products,
      operation: operationArray
    }

    console.log(sendObject);

    if (this.wearCalculationForm.valid && this._checkIsValidTabs()) {
      this._loadingService.showLoading()
      this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
        this._componentDataService.offClick();
        this._dialogRef.close({ value: true })
        this._loadingService.hideLoading()
      }, (err) => {
        this._mainService.translateServerError(err)
        this._loadingService.hideLoading()
      })
    } else {
      this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.wearCalculationForm)
    }
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.wearCalculationForm, controlName, property)
  }

  public setValue(event, controlName?: string): void {
    this.wearCalculationForm.get(controlName).setValue(event);
    this.onFocus(this.wearCalculationForm, controlName)

  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }

  public setModalParams(title: string) {
    let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: ['code', 'name'] };
    return modalParams
  }
  ngOnDestroy(): void {
    this._loadingService.hideLoading()
    this._subscription1.unsubscribe()
    this._subscription.unsubscribe()
  }
  get error(): string {
    return this._error
  }
  get activeTab(): string {
    return this._activeTab
  }
}
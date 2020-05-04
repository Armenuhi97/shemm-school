import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShortModel, AnalyticalGroup, Partner, AccountPlans, MaterialValues, ModalDataModel, DataCount, ServerResponse, Employees, JsonObjectType, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ComponentDataService, AppService, OftenUsedParamsService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';

@Component({
  selector: 'app-acquisition-operation-calculators',
  templateUrl: './acquisition-operation-calculators.component.html',
  styleUrls: ['./acquisition-operation-calculators.component.scss']
})
export class AcquisitionOperationCalculatorsModal implements OnInit {
  public tabsItem = [
    { title: 'Ընդհանուր', key: 'general', isValid: true },
    { title: 'Հաշվառումներ', key: 'accounting', isValid: true },
    { title: 'Հաշիվներ', key: 'accounts', isValid: true },
    { title: 'Լրացուցիչ', key: 'additional', isValid: true },
    { title: 'Գործառնություններ', key: 'operation', isValid: true }]
  public title: string;
  public employees: Employees[] = []
  private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
  private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
  private _error: string;
  public subdivisions: ShortModel[] = []
  public formGroup: FormGroup;
  public hmTypes = [];
  public hmProfitTaxs = []
  public activeTab: string;
  private _subscription: Subscription;
  public analyticalGroup1: AnalyticalGroup[] = [];
  public analyticalGroup2: AnalyticalGroup[] = []
  public partners: Partner[] = [];
  public chartAccounts: AccountPlans[] = []
  public unitOfMeasurements: MaterialValues[] = [];
  private _subscription1: Subscription;
  private _lastProduct;
  private _products;
  public calculationTypes: JsonObjectType[] = []

  constructor(private _dialogRef: MatDialogRef<AcquisitionOperationCalculatorsModal>,
    private _messageService: MessageService,

    @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _componentDataService: ComponentDataService,
    private _appService: AppService,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    private _oftenUsedParamsService: OftenUsedParamsService,
    @Inject('URL_NAMES') private _urls) {
    this.title = this._data.title;
    this._validate()

  }
  ngOnInit() {
    this._setDataFromTabs()
  }
  private setCommonInfo(data) {
    let object = {}
    if (data) {
    }
  }
  private _getOperationArray(body): void {
    this._mainService.getOperationArray(this._urls.reconstructionFunctionUrl, body, this.formGroup, this._fb, this.tabsItem)
  }

  private _setDataFromTabs(): void {
    this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
      if (data) {
        // if (data.type == 'general') {

        //   if (data.data) {
        //     this._products = this.setCommonInfo(data.data);

        //     if (!(this._products == this._lastProduct)) {
        //       this._getOperationArray(this._products)
        //     }
        //     this._lastProduct = this.setCommonInfo(data.data)
        //   }
        // }

        this.formGroup.get(data.type).setValue(data.data);

        for (let i = 0; i < this.tabsItem.length; i++) {
          if (this.tabsItem[i].key == data.type) {
            this.tabsItem[i].isValid = data.isValid
          }
        }
      }
    })
  }

  public close() {
    this._dialogRef.close()
  }
  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(

      this._mainService.getMaterialValues(),
      this._mainService.getAnalyticGroupCount(this._group1),
      this._mainService.getAnalyticGroupCount(this._group2),
      this._mainService.getPartnerCount(),
      this._mainService.getAccountsPlan(),
      this._getHmTypesCount(),
      this._gethmProfitTaxsCount(),
      this._getEmployeesCount(),
      this._mainService.getCalculationTypes()

    )
    this._subscription = combine.subscribe((data) => {
      this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
      this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
      this.partners = this._oftenUsedParams.getPartners();
      this.chartAccounts = this._oftenUsedParams.getChartAccounts();
      this.unitOfMeasurements = this._oftenUsedParams.getMaterialValues();
      this.calculationTypes = this._oftenUsedParamsService.getCalculationTypes();
      this._loadingService.hideLoading()
    })
  }
  private _generateFolderNumber(): void {
    if (!this._data.id) {
        this._mainService.generateField(this._data.url, 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
            this.formGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        },
            () => {
                this._loadingService.hideLoading()
            })
    } else {
        this._loadingService.hideLoading()

    }
}
  private _getHmTypesCount() {
    return this._mainService.getCount(this._urls.hmTypesMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getHmTypes(data.data.count)
      })
    )
  }
  private _getHmTypes(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.hmTypesMainUrl, count, 0).pipe(
      map((data: ServerResponse<any>) => {
        this.hmTypes = data.data
      })
    )
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
  private _gethmProfitTaxsCount() {
    return this._mainService.getCount(this._urls.hmProfitTaxsMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getHmProfitTaxs(data.data.count)
      })
    )
  }
  private _getHmProfitTaxs(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.hmProfitTaxsMainUrl, count, 0).pipe(
      map((data: ServerResponse<any>) => {
        this.hmProfitTaxs = data.data
      })
    )
  }
  private _validate() {
    this.formGroup = this._fb.group({
      propertyNumber: [null, Validators.required],
      name: [null, Validators.required],
      fullName: [null],
      enterDate: [this.setTodayDate(), Validators.required],
      operationDate: [this.setTodayDate(), Validators.required],
      assetsType: [null, Validators.required],
      assetsGroup: [null],
      materialAswer: [null, Validators.required],
      assetsAcquisitionMethod: [null, Validators.required],
      location: [null, Validators.required],
      operation: [null],
      general: [null],
      additional: [null],
      accounts: [null],
      accounting: [null]
    })
    this._combineObservable()
  }



  public isClickOnAddButton($event): void {
    if ($event && !$event.isClick) {
      this._subscription1.unsubscribe()
    } else {
      if ($event && $event.isClick)
        if ($event.isValue) {
          this._loadingService.showLoading()
          this._mainService.getPartnerCount().subscribe(() => {
            this.partners = this._oftenUsedParamsService.getPartners();
            this._loadingService.hideLoading()
          })
        }
      this._setDataFromTabs()
    }
  }
  public save(): void {
    this._componentDataService.onClick();

    let operationArray = []
    if (this.formGroup.get('operation') && this.formGroup.get('operation').value) {
      this.formGroup.get('operation').value.forEach((element) => {
        let data = element.value;
        let object = this._appService.getOperationObject(data)
        operationArray.push(object)
      })
    }
    this._appService.markFormGroupTouched(this.formGroup);
    // let generalObject = this.setCommonInfo(this.formGroup.get('general').value)
    let sendObject = {

      propertyNumber: this.formGroup.get('propertyNumber').value,
      name: this.formGroup.get('name').value,
      fullName: this.formGroup.get('fullName').value,
      enterDate: this._datePipe.transform(this.formGroup.get('enterDate').value, 'yyyy-MM-dd'),
      operationDate: this._datePipe.transform(this.formGroup.get('operationDate').value, 'yyyy-MM-dd'),
      assetsTypeId: this._appService.checkProperty(this.formGroup.get('assetsType').value, 'id'),
      assetsGroupId: this._appService.checkProperty(this.formGroup.get('assetsGroup').value, 'id'),
      materialAswer: this._appService.checkProperty(this.formGroup.get('materialAswer').value, 'id'),
      assetsAcquisitionMethod: this._appService.checkProperty(this.formGroup.get('assetsAcquisitionMethod').value, 'id'),
      location: this.formGroup.get('assetsAcquisitionMethod').value,
      //general
      propertyCard: this._appService.checkProperty(this.formGroup.get('general').value, 'propertyCard'),
      folderNumber: this._appService.checkProperty(this.formGroup.get('general').value, 'folderNumber'),
      partnerId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('general').value, 'partner'), 'id'),
      partnerAccountId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('general').value, 'partnerAccount'), 'id'),
      analyticalGroup1: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('general').value, 'analyticalGroup1'), 'id'),
      analyticalGroup2: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('general').value, 'analyticalGroup2'), 'id'),
      acquisitionDocument: this._appService.checkProperty(this.formGroup.get('general').value, 'acquisitionDocument'),
      acquisitionDate: this._datePipe.transform(this._appService.checkProperty(this.formGroup.get('general').value, 'acquisitionDate'), 'yyyy-MM-dd'),
      statementMethod: this._appService.checkProperty(this.formGroup.get('general').value, 'statementMethod'),
      calculateType: this._appService.checkProperty(this.formGroup.get('general').value, 'calculateType'),
      //accounting
      financeUsefulLife: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeUsefulLife'),
      financeInitialCost: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeInitialCost'),
      financeCalculatedWear: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeCalculatedWear'),
      financeResidualValue: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeResidualValue'),
      financeIsWorn: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeIsWorn') ? true : false,
      taxUsefulLife: this._appService.checkProperty(this.formGroup.get('accounting').value, 'taxUsefulLife'),
      taxInitialCost: this._appService.checkProperty(this.formGroup.get('accounting').value, 'taxInitialCost'),
      taxCalculatedWear: this._appService.checkProperty(this.formGroup.get('accounting').value, 'taxCalculatedWear'),
      taxResidualValue: this._appService.checkProperty(this.formGroup.get('accounting').value, 'taxResidualValue'),
      taxIsWorn: this._appService.checkProperty(this.formGroup.get('accounting').value, 'taxIsWorn') ? true : false,
      financialUsefulLife: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financialUsefulLife'),
      financialCalculatedWear: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financialCalculatedWear'),
      financialIsWorn: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financialIsWorn') ? true : false,
      financeDeferredRevenue: this._appService.checkProperty(this.formGroup.get('accounting').value, 'financeDeferredRevenue'),
      //accounts
      initialCostAccount: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'initialCostAccount'), 'id'),
      wornAccount: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'wornAccount'), 'id'),
      expenseAccount: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'expenseAccount'), 'id'),
      incomeStatement: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'incomeStatement'), 'id'),
      currentPortionOfDeferredRevenueAccount: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'currentPortionOfDeferredRevenueAccount'), 'id'),
      deferredRevenueAccount: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('accounts').value, 'deferredRevenueAccount'), 'id'),
      //additional
      startYear: this._appService.checkProperty(this.formGroup.get('additional').value, 'startYear'),
      serialNumber: this._appService.checkProperty(this.formGroup.get('additional').value, 'serialNumber'),
      technicalProfile: this._appService.checkProperty(this.formGroup.get('additional').value, 'technicalProfile'),
      stamp: this._appService.checkProperty(this.formGroup.get('additional').value, 'stamp'),
      briefReview: this._appService.checkProperty(this.formGroup.get('additional').value, 'briefReview'),
      manufacturer: this._appService.checkProperty(this.formGroup.get('additional').value, 'manufacturer'),
      //operation
      operation: operationArray
    }


    console.log(sendObject);

    if (this.formGroup.valid) {
      this._loadingService.showLoading()
      if (!this._data.id) {
        this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
          this._componentDataService.offClick();
          this._dialogRef.close({ value: true })
          this._loadingService.hideLoading()
        }, (err) => {
          this._mainService.translateServerError(err)
          this._loadingService.hideLoading()
        })
      } else {
        this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe(() => {
          this._componentDataService.offClick()
          this._dialogRef.close({ value: true, id: this._data.id });
          this._loadingService.hideLoading()
        }, (err) => {
          this._mainService.translateServerError(err)
          this._loadingService.hideLoading()
        })
      }
    } else {
      this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.formGroup)
    }
  }
  public getActiveTab(event): void {
    this._componentDataService.onClick()
    this.activeTab = event.title;
  }

  public setTodayDate(): Date {
    let today = new Date();
    return today
  }
  public setValue(event, controlName: string): void {
    this.formGroup.get(controlName).setValue(event);
    this.onFocus(this.formGroup, controlName)

  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.formGroup, controlName, property)
  }

  public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
    let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
    return modalParams
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
    this._subscription1.unsubscribe();
    this._loadingService.hideLoading()
  }
  get error(): string {
    return this._error
  }
  get type(): number {
    return this._data.type
  }

}



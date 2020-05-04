import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ServerResponse, DataCount, AnalyticalGroup, Currency, BillingAccountInBanksPayload, AccountPlans, Partner, GenerateType, BankAccount, ModalDataModel } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { AppService, LoadingService, OftenUsedParamsService, ComponentDataService } from 'src/app/com/annaniks/shemm-school/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'payment-order-modal',
  templateUrl: 'payment-order․modal.html',
  styleUrls: ['payment-order․modal.scss']
})
export class PaymentOrderModal {
  private _isSend: boolean = true
  public exitSpecification = [];
  public bankAccount: BankAccount[] = []
  private _subscription2: Subscription;
  public paymentOrderGroup: FormGroup;
  public activeTab: string;
  public title: string;
  public operationSignificanse = [];
  private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
  private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
  private _lastProductArray = [];
  public analyticalGroup1: AnalyticalGroup[] = [];
  public analyticalGroup2: AnalyticalGroup[] = []
  private _subscription1: Subscription;
  private _subscription: Subscription
  public partners: Partner[] = [];
  public chartAccounts: AccountPlans[] = []
  public tabsItem = [{ title: 'Ընդհանուր', isValid: true, key: 'general' },
  { title: 'Գործառնություններ', isValid: true, key: 'operation' }]

  constructor(private _dialogRef: MatDialogRef<PaymentOrderModal>,
    @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    @Inject('URL_NAMES') private _urls,
    private _mainService: MainService,
    private _fb: FormBuilder,
    private _appService: AppService,
    private _componentDataService: ComponentDataService,
    private _loadingService: LoadingService,
    private _datePipe: DatePipe,
    private _oftenUsedParamsService: OftenUsedParamsService) {
    this.title = this._data.title;
    this._validate()
  }

  ngOnInit() {
    this._setDataFromTabs()
  }

  private setMaterialListArray(data, isSetId?: boolean) {
    let materailAssets = []
    data.forEach((element) => {
      let data = element.value;      
      let object = {
        billingAccountInBanksId: this._appService.checkProperty(data.bankAccount, 'id'),
        operationSignificanceId: this._appService.checkProperty(data.transactionSignificance, 'id'),
        partnersId: this._appService.checkProperty(data.partner, 'id'),
        billingAccountId: this._appService.checkProperty(data.partnerAccountNumber, 'id'),
        coefficient: data.coefficient?data.coefficient:1,
        money: data.amount,
        
      }
      if (isSetId) {
        let groupCount = []
        data.groupCount.forEach((group) => {          
          let money =group.paidMoney.status?group.paidMoney.value:group.paidMoney
          if (money) {
            groupCount.push({
              operationId: group.id,
              money: money,
              date: group.date
            })
          }
        })
        object['paymentAssignmentPaymentOperation'] = groupCount
      } else {
        object['degrees'] = data.bonus;
        object['paymentAssignmentOperation'] = data.allGroupCount
      }
      materailAssets.push(object)
    })

    return materailAssets
  }

  private _setDataFromTabs(): void {

    this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
      if (data) {
        if (data.type == 'general') {
          let materailAssets = data.data.controls;
          if (materailAssets) {
         
            this.paymentOrderGroup.get(data.type).setValue(materailAssets);

            let products = []
            products = this.setMaterialListArray(materailAssets);
            if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
              this._isSend = false
              this._componentDataService.onIsGetOperation()
              this._getOperationArray(products)
            }
            else {
              this._isSend = true
            }
            this._lastProductArray = []
            this._lastProductArray = this.setMaterialListArray(materailAssets)

          }
        } else {
          this._isSend = true
          this.paymentOrderGroup.get(data.type).setValue(data.data);
        }
        // if (data.isDeletedArray && data.isDeletedArray.length)
        //     if (data.type == 'operation' && data.isDeletedArray) {
        //         data.isDeletedArray.forEach(element => {
        //             this._deletedOperation.push(element)
        //         });
        //     }
        for (let i = 0; i < this.tabsItem.length; i++) {
          if (this.tabsItem[i].key == data.type) {
            this.tabsItem[i].isValid = data.isValid
          }
        }

      }

    })
  }

  private _getBankAccountCount(): Observable<void> {
    return this._mainService.getCount(this._urls.bankAccountMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getBankAccount(data.data.count)
      })
    )
  }
  private _getBankAccount(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.bankAccountMainUrl, count, 0).pipe(
      map((data: ServerResponse<BankAccount[]>) => {
        this.bankAccount = data.data
      })
    )
  }

  private _getOperationArray(body): void {
    this._mainService.getOperationArray(this._urls.paymentOrderFunctionUrl, body, this.paymentOrderGroup, this._fb, this.tabsItem)

  }
  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }

  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getPartnerCount(),
      this._mainService.getAccountsPlan(),
      this._getOperationSignificanceCount(),
      this._mainService.getAnalyticGroupCount(this._group1),
      this._mainService.getAnalyticGroupCount(this._group2),
      this._getBankAccountCount()
    )
    this._subscription = combine.subscribe((data) => {
      this.analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
      this.analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
      this.partners = this._oftenUsedParamsService.getPartners();
      this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
      if (data) {
        this._getPaymentOrderById()
      }
    })
  }
  private _getOperationSignificanceCount(): Observable<void> {
    return this._mainService.getCount(this._urls.operationSignificanceMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getOperationSignificance(data.data.count)
      })
    )
  }
  private _getOperationSignificance(count: number): Observable<void> {
    return this._mainService.getByUrl(this._urls.operationSignificanceMainUrl, count, 0).pipe(
      map((data: ServerResponse<any[]>) => {
        this.operationSignificanse = data.data
      })
    )
  }
  private _generateDocumentNumber(): void {
    this._mainService.generateField('payment_assignment', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
      this.paymentOrderGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
      this._loadingService.hideLoading()
    }, () => this._loadingService.hideLoading())
  }

  private _getPaymentOrderById(): void {
    if (this._data.id) {
      this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<any>) => {
        if (data) {
          let paymentAssignment = data.data;
          this.exitSpecification = []
          let productArray = [];
          let array = []
          paymentAssignment.paymentAssignmentMain.forEach((element) => {
            let obj = {
              bankAccount: this._appService.checkProperty(this._appService.filterArray(this.bankAccount, element.billingAccountInBanksId, 'id'), 0),
              transactionSignificance: this._appService.checkProperty(this._appService.filterArray(this.operationSignificanse, element.operationSignificanceId, 'id'), 0),
              partner: this._appService.checkProperty(this._appService.filterArray(this.partners, element.partnersId, 'id'), 0),
              partnerAccountNumber: { billingId: element.billingAccountId },
              amount: element.money,
              dept: 0,
              sum: 0,
              bonus: 0,
              groupCount: this._fb.array([]),
              partnersAccountNumbersArray: [],
              coefficient: element.coefficient,
              allGroupCount: this._fb.array([])
            }

            productArray.push(this._fb.group(obj));

            array.push(element.paymentAssignmentPaymentOperation)

          })
          this.exitSpecification = array
          this.paymentOrderGroup.patchValue({
            date: new Date(paymentAssignment.date),
            folderNumber: paymentAssignment.documentNumber,
            general: productArray,
            operation: this._mainService.setOperationArray(paymentAssignment.paymentAssignmentOperation, this._fb)
          })

          this._lastProductArray = this.setMaterialListArray(productArray)
          this._loadingService.hideLoading()

        }
      })
    } else {
      this.paymentOrderGroup.get('date').setValue(this.setTodayDate());
      this._generateDocumentNumber()
    }

  }

  public close(): void {
    this._dialogRef.close();
    this._componentDataService.offClick()
  }

  public getActiveTab(event): void {
    if (event.title) {
      this._componentDataService.onClick();
      this.activeTab = event.title
    }
  }
  private _validate(): void {
    this.paymentOrderGroup = this._fb.group({
      date: [null, Validators.required],
      folderNumber: [null, Validators.required],
      general: [null],
      operation: [[]]
    })
    this._combineObservable()

  }
  public save() {
    this._componentDataService.onClick();
    if (this._isSend) {
      this.sendData()
    } else {
      this._subscription2 = this._componentDataService.getIsGetOperationState().subscribe((data) => {
        this._subscription2.unsubscribe()
        if (!data.isGet) {
          this.sendData()
        }
      })
    }
  }

  public sendData(): void {
    let materailAssets = [];
    if (this.paymentOrderGroup.get('general') && this.paymentOrderGroup.get('general').value) {
      materailAssets = this.setMaterialListArray(this.paymentOrderGroup.get('general').value, true);
    }
    let operationArray = []
    if (this.paymentOrderGroup.get('operation') && this.paymentOrderGroup.get('operation').value) {
      this.paymentOrderGroup.get('operation').value.forEach((element) => {
        let data = element.value
        let object = this._appService.getOperationObject(data)

        operationArray.push(object)
      })
    }
    this._appService.markFormGroupTouched(this.paymentOrderGroup);

    let sendObject = {
      date: this._datePipe.transform(this.paymentOrderGroup.get('date').value, 'yyyy-MM-dd'),
      documentNumber: this.paymentOrderGroup.get('folderNumber').value,
      paymentAssignmentMain: materailAssets,
      paymentAssignmentOperation: operationArray
    }

    if (this.paymentOrderGroup.valid) {
      this._loadingService.showLoading()
      if (!this._data.id) {
        this._add(sendObject)
      } else {
        this._mainService.deleteByUrl(this._data.url, this._data.id).subscribe((data) => {
          if (data) {
            this._add(sendObject)
          }
        },
          (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading()
          })
      }
    } else {

      this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.paymentOrderGroup)
    }

  }

  private _add(sendObject) {
    this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
      this._componentDataService.offClick();
      this._dialogRef.close({ value: true })
      this._loadingService.hideLoading()
    }, (err) => {
      this._mainService.translateServerError(err)
      this._componentDataService.offClick()
      this._loadingService.hideLoading()
    })
  }
  private _checkIsValid(): boolean {
    return this._appService.checkIsValid(this.tabsItem)
  }
  public setTodayDate(): Date {
    let today = new Date();
    return today
  }
  public setValue(event, controlName: string): void {
    this.paymentOrderGroup.get(controlName).setValue(event);
    this.onFocus(this.paymentOrderGroup, controlName)
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.paymentOrderGroup, controlName, property)
  }
  public setModalParams(title: string, tabs: Array<string>, properties: Array<string>) {
    let modalParams = { tabs: tabs, title: title, keys: properties };
    return modalParams
  }
  ngOnDestroy() {
    this._oftenUsedParamsService.setPreviousValue(null)
    this._oftenUsedParamsService.setPreviousValue2(null);
    if (this._subscription2) {
      this._subscription2.unsubscribe()
    }
    this._loadingService.hideLoading()
    this._subscription1.unsubscribe();
    this._subscription.unsubscribe()
  }
}
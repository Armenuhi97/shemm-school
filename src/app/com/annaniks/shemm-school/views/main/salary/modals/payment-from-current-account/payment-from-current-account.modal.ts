import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AnalyticalGroup, Partner, WareHouse, AccountPlans, MaterialValues, ModalDataModel, ServerResponse, DataCount, ShortModel, Table } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MaterialValuesShiftModal } from '../../../warehouse/modals';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'payment-from-current-account-modal',
    templateUrl: 'payment-from-current-account.modal.html',
    styleUrls: ['payment-from-current-account.modal.scss']
})
export class PaymentFromCurrencyAccountModal {
    public title: string;
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public subdivisions: ShortModel[] = []
    public currencyAccountPaymentGroup: FormGroup;
    public activeTab: string;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    public warehouses: WareHouse[] = [];
    public unitOfMeasurements: MaterialValues[] = [];
    private _subscription1: Subscription;
    private _lastProductArray = []
    public tables: Table[] = []
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Գործառնություններ', key: 'accountOperation', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<MaterialValuesShiftModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }
    private setPaymentFromCurrentAccount(data) {
        let paymentFromCurrentAccount = [];
        if (data)
            data.forEach((element) => {
                let el = element.value;
                let object = {
                    subdivisionId: this._appService.checkProperty(el.unit, 'id'),
                    reportCardId: this._appService.checkProperty(el.reportCard, 'id'),
                    name: el.name,
                    byHands: el.byHands,
                    paidAmount: el.paidAmount
                }
                paymentFromCurrentAccount.push(object)
            })

        return paymentFromCurrentAccount
    }
    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.paymentFromCurrentAccountFunctionUrl, body, this.currencyAccountPaymentGroup, this._fb, this.tabsItem)
    }

    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'general') {
                    let paymentFromCurrentAccount = data.data.value;

                    if (data.data.controls && data.data.controls.listArray && data.data.controls.listArray.controls) {
                        paymentFromCurrentAccount['listArray'] = data.data.controls.listArray.controls
                        this.currencyAccountPaymentGroup.get(data.type).setValue(paymentFromCurrentAccount);
                        let products = [];
                        products = this.setPaymentFromCurrentAccount(paymentFromCurrentAccount.listArray);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._getOperationArray(products)
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setPaymentFromCurrentAccount(paymentFromCurrentAccount.listArray)
                    }
                } else {
                    this.currencyAccountPaymentGroup.get(data.type).setValue(data.data);
                }
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
            this._mainService.getWarehouseCount(),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._getSubdivisionCount(),
            this._getTableCount()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
            this.warehouses = this._oftenUsedParams.getWarehouse();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this.unitOfMeasurements = this._oftenUsedParams.getMaterialValues();
            this._loadingService.hideLoading()
        })
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

    private _getTableCount(): Observable<void> {
        return this._mainService.getCount(this._urls.tableMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getTable(data.data.count)
            })
        )
    }
    private _getTable(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.tableMainUrl, count, 0).pipe(
            map((data: ServerResponse<Table[]>) => {
                this.tables = data.data;
            })
        )
    }

    private _validate() {
        this.currencyAccountPaymentGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            settlementDate: [null, Validators.required],
            general: [null],
            operation: [null],
            accountOperation: [null]
        })
        this._combineObservable()
    }


    public save(): void {
        this._componentDataService.onClick();
        let paymentFromCurrentAccount = [];

        if (this.currencyAccountPaymentGroup.get('general') && this.currencyAccountPaymentGroup.get('general').value && this.currencyAccountPaymentGroup.get('general').value.listArray) {
            this.currencyAccountPaymentGroup.get('general').value.listArray.forEach((value) => {
                let data = value.value
                let object = {
                    subdivisionId: this._appService.checkProperty(data.unit, 'id'),
                    reportCardId: this._appService.checkProperty(data.reportCard, 'id'),
                    name: data.name,
                    byHands: data.byHands,
                    paidAmount: data.paidAmount
                }
                paymentFromCurrentAccount.push(object)
            })
        }

        let operationArray = []
        if (this.currencyAccountPaymentGroup.get('operation') && this.currencyAccountPaymentGroup.get('operation').value) {
            this.currencyAccountPaymentGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.currencyAccountPaymentGroup);

        let sendObject = {
            date: this._datePipe.transform(this.currencyAccountPaymentGroup.get('date').value, 'yyyy-MM-dd'),
            folderNumber: this.currencyAccountPaymentGroup.get('folderNumber').value,
            settlementDate: this.currencyAccountPaymentGroup.get('settlementDate').value,
            paymentTypeId: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'paymentType'), 'id'),
            subdivisionId: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'unit'), 'id'),
            analyticGroup1Id: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'analyticGroup1'), 'id'),
            analyticGroup2Id: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'analyticGroup2'), 'id'),
            paymentAccountId: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'paymentAccount'), 'account'),
            comment: this._appService.checkProperty(this.currencyAccountPaymentGroup.get('general').value, 'comment'),
            /////
            date2: this._datePipe.transform(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('accountOperation').value, 'date'), 'yyyy-MM-dd'),
            correspondentAccount: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('accountOperation').value, 'account'), 'account'),
            account: this._appService.checkProperty(this._appService.checkProperty(this.currencyAccountPaymentGroup.get('accountOperation').value, 'correspondentAccount'), 'account'),
            operation: operationArray,
            product: paymentFromCurrentAccount

        }
        console.log(sendObject);

        if (this.currencyAccountPaymentGroup.valid) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.currencyAccountPaymentGroup)
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
        this.currencyAccountPaymentGroup.get(controlName).setValue(event);
        this.onFocus(this.currencyAccountPaymentGroup, controlName)
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.currencyAccountPaymentGroup, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
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
}
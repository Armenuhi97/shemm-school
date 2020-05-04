import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDataModel, MaterialValues, Partner, AnalyticalGroup, ShortModel, AccountPlans, DataCount, ServerResponse, Employees } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { SelectDocumentTypeModal } from 'src/app/com/annaniks/shemm-school/modals';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'act-putting-into-operation',
    templateUrl: 'act-putting-into-operation.modal.html',
    styleUrls: ['act-putting-into-operation.modal.scss']
})
export class ActPuttingIntoOperationModal {
    public title: string;
    public documentKind: Array<{ text: string, id: number }> = []
    public employees: Employees[] = []
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public subdivisions: ShortModel[] = []
    public actPuttingIntoOoperationGroup: FormGroup;
    public activeTab: string;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    public unitOfMeasurements: MaterialValues[] = [];
    private _subscription1: Subscription;
    private _lastProductArray = [];
    private _products = []
    public tabsItem = [
        { title: 'Գույքահամարներ', key: 'advertisingServices', isValid: true },
        { title: 'Գործառնություններ', key: 'operation', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<ActPuttingIntoOperationModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _messageService: MessageService,

        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()
        this.documentKind = this._appService.getDocumentKind()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }
    private setPaymentFromCurrentAccount(data) {
        let paymentFromCurrentAccount = [];
        if (data && data.length) {
            data.forEach((element) => {
                let object = {
                    inventory: element.inventory.value,
                    name: element.name.value,
                    initialInvoiceValue: this._appService.checkProperty(element.initialInvoiceValue.value, 'id'),
                    depreciationAccount: this._appService.checkProperty(element.depreciationAccount.value, 'id'),
                    expenseExpense: this._appService.checkProperty(element.expenseExpense.value, 'id'),
                    deferredIncome: this._appService.checkProperty(element.deferredIncome.value, 'id'),
                    deferredIncome2: this._appService.checkProperty(element.deferredIncome2.value, 'id'),
                    incomeAccount: this._appService.checkProperty(element.incomeAccount.value, 'id'),
                    isWearFinance: element.isWearFinance.value,
                    isWearFax: element.isWearFax.value,
                    isWearRevenue: element.isWearRevenue.value
                }
                paymentFromCurrentAccount.push(object)
            })
        }
        return paymentFromCurrentAccount
    }
    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.actPuttingIntoOperationFunctionUrl, body, this.actPuttingIntoOoperationGroup, this._fb, this.tabsItem)
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
                        this._products = this.setPaymentFromCurrentAccount(advertisingServices);
                        if (!this._appService.checkIsChangeProductArray(this._products, this._lastProductArray)) {
                            this._getOperationArray(this._products)
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setPaymentFromCurrentAccount(advertisingServices)
                    }
                }

                this.actPuttingIntoOoperationGroup.get(data.type).setValue(data.data);

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
            this._getSubdivisionCount(),
            this._getEmployeesCount()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
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

    private _validate() {
        this.actPuttingIntoOoperationGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null],
            transmittingUnit: [null, Validators.required],
            transmittingMaterialPerson: [null, Validators.required],
            receivingUnit: [null, Validators.required],
            receivingMaterialPerson: [null, Validators.required],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null],
            operation: [null],
            advertisingServices: [null]

        })
        this._combineObservable()
    }


    public save(): void {
        this._componentDataService.onClick();

        let operationArray = []
        if (this.actPuttingIntoOoperationGroup.get('operation') && this.actPuttingIntoOoperationGroup.get('operation').value) {
            this.actPuttingIntoOoperationGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.actPuttingIntoOoperationGroup);

        let sendObject = {

            date: this._datePipe.transform(this.actPuttingIntoOoperationGroup.get('date').value, 'yyyy-MM-dd'),
            folderNumber: this.actPuttingIntoOoperationGroup.get('folderNumber').value,
            transmittingUnitId: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('transmittingUnit').value, 'id'),
            transmittingMaterialPersonId: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('transmittingMaterialPerson').value, 'id'),
            receivingUnitId: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('receivingUnit').value, 'id'),
            receivingMaterialPersonId: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('receivingMaterialPerson').value, 'id'),
            analyticalGroup1Id: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('analyticalGroup1').value, 'id'),
            analyticalGroup2Id: this._appService.checkProperty(this.actPuttingIntoOoperationGroup.get('analyticalGroup2').value, 'id'),
            comment: this.actPuttingIntoOoperationGroup.get('comment').value,
            advertisingServices: this._products,
            operation: operationArray


        }

        console.log(sendObject);

        if (this.actPuttingIntoOoperationGroup.valid) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.actPuttingIntoOoperationGroup)
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
        this.actPuttingIntoOoperationGroup.get(controlName).setValue(event);
        this.onFocus(this.actPuttingIntoOoperationGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.actPuttingIntoOoperationGroup, controlName, property)
    }
    public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public getModalName() {
        return SelectDocumentTypeModal
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
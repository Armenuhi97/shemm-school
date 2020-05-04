import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDataModel, DeletedFormArrayModel, AnalyticalGroup, Partner, AccountPlans, MaterialValues, ServerResponse, OperationModel, DataCount, Currency, Services, JsonObjectType, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'receive-service-modal',
    templateUrl: 'receive-service.modal.html',
    styleUrls: ['receive-service.modal.scss']
})
export class ReceiveServiceModal {
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private subscription: Subscription;
    public currencyArray: Currency[] = []
    public title: string;
    public services: Services[] = []
    private _error: string;
    public receiveServicesGroup: FormGroup;
    public activeTab: string;
    private _deletedProducts: DeletedFormArrayModel[] = [];
    private _deletedOperation: DeletedFormArrayModel[] = [];;
    private _analyticalGroup1: AnalyticalGroup[] = [];
    private _analyticalGroup2: AnalyticalGroup[] = []
    private _partners: Partner[] = [];
    private _chartAccounts: AccountPlans[] = []
    private _unitOfMeasurements: MaterialValues[] = [];
    private _subscription1: Subscription;
    private _lastProductArray = []
    public calculationTypes: JsonObjectType[] = []
    public typeOfAcquisition: JsonObjectType[] = [];
    public aahFormOfReflection: JsonObjectType[] = []
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Անվանացուցակ', key: 'namesList', isValid: true },
        { title: 'Գործառնություններ', key: 'operation', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<ReceiveServiceModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls,
        private _messageService: MessageService,
    ) {
        this.title = this._data.title;
        this._validate()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }
    private setMaterialListArray(data) {
        let namesListProduct = []
        data.forEach((element) => {
            let el = element.value
            let object = {
                materialValueId: el.materialValuesId,
                point: el.point,
                count: el.count,
                price: el.price,
                money: el.amount,
                serviceId: el.servicesId,
                aah: el.isAah,
                account: this._appService.checkProperty(el.account, 'account')
            }
            namesListProduct.push(object)
        })

        return namesListProduct
    }
    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.receiveServiceFunctionUrl, body, this.receiveServicesGroup, this._fb, this.tabsItem)
    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'namesList') {
                    let namesListProduct = data.data.value;
                    if (data.data.controls && data.data.controls.products && data.data.controls.products.controls) {
                        namesListProduct['products'] = data.data.controls.products.controls
                        this.receiveServicesGroup.get(data.type).setValue(namesListProduct);
                        let products = []
                        products = this.setMaterialListArray(namesListProduct.products);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._getOperationArray(products)
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setMaterialListArray(namesListProduct.products)

                    }
                    if (data.isDeletedArray && data.isDeletedArray.length)
                        data.isDeletedArray.forEach(element => {
                            this._deletedProducts.push(element)
                        });

                } else {
                    this.receiveServicesGroup.get(data.type).setValue(data.data);
                }
                if (data.isDeletedArray && data.isDeletedArray.length)
                    if (data.type == 'operation' && data.isDeletedArray) {
                        data.isDeletedArray.forEach(element => {
                            this._deletedOperation.push(element)
                        });
                    }
                for (let i = 0; i < this.tabsItem.length; i++) {
                    if (this.tabsItem[i].key == data.type) {
                        this.tabsItem[i].isValid = data.isValid
                    }
                }
            }
        })
    }

    public isClickOnAddButton($event): void {
        if ($event && !$event.isClick) {
            this._subscription1.unsubscribe()
        } else {
            if ($event && $event.isClick)
                if ($event.isValue) {
                    this._loadingService.showLoading()
                    this._mainService.getPartnerCount().subscribe(() => {
                        this._partners = this._oftenUsedParamsService.getPartners()
                        this._loadingService.hideLoading()
                    })

                }
            this._setDataFromTabs()
        }
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
            this._mainService.getServiceCount(),
            this._mainService.getAahReflectionForm(),
            this._mainService.getCalculationTypes(),
            this._mainService.getTypeOfAcquisition(),
            this._getCurrenciesCount()
        )
        this.subscription = combine.subscribe((data) => {
            this._analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this._analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this._partners = this._oftenUsedParamsService.getPartners();
            this._chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this._unitOfMeasurements = this._oftenUsedParamsService.getMaterialValues();
            this.services = this._oftenUsedParamsService.getServices()
            this.aahFormOfReflection = this._oftenUsedParamsService.getAahReflectionForm()
            this.calculationTypes = this._oftenUsedParamsService.getCalculationTypes()
            this.typeOfAcquisition = this._oftenUsedParamsService.getTypeOfAcquisition()
            this._generateDocumentNumber()
        })

    }
    private _generateDocumentNumber(): void {
        if (!this._data.id) {
            this._mainService.generateField('received_service', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
                this.receiveServicesGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
                this._loadingService.hideLoading()
            }, () => { this._loadingService.hideLoading() })
        } else {
            this._loadingService.hideLoading()
        }
    }
    private _getCurrenciesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.currenciesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getCurrencies(data.data.count)
            })
        )
    }

    private _getCurrencies(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.currenciesMainUrl, count, 0).pipe(
            map((data: ServerResponse<Currency[]>) => {
                this.currencyArray = data.data;
            })
        )
    }

    private _validate() {
        this.receiveServicesGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            general: [null],
            namesList: [null],
            operation: [null]
        })
        this._combineObservable()
    }

    public save(): void {
        this._componentDataService.onClick();
        let namesListProduct = [];

        if (this.receiveServicesGroup.get('namesList') && this.receiveServicesGroup.get('namesList').value && this.receiveServicesGroup.get('namesList').value.products) {
            namesListProduct = this.setMaterialListArray(this.receiveServicesGroup.get('namesList').value.products);
        }

        let operationArray = []
        if (this.receiveServicesGroup.get('operation') && this.receiveServicesGroup.get('operation').value) {
            this.receiveServicesGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }

        this._appService.markFormGroupTouched(this.receiveServicesGroup);

        let sendObject = {
            currencyId: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'currency'), 'id'),
            currencyExchangeRate1: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'exchangeRate'),
            currencyExchangeRate2: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'exchangeRateFrom'),
            previousDayExchangeRate: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'previousDayCourse') ? true : false,
            partnersId: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'provider'), 'id'),
            providerAccountId: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'providerAccount'), 'account'),
            advancePaymentAccountId: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'givenAdvancePaymentAccount'), 'account'),
            analiticGroup_1Id: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'analyticalGroup1'), 'id'),
            analiticGroup_2Id: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'analyticalGroup2'), 'id'),
            outputMethod: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'dischargeMethod'),
            purchaseDocumentNumber: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'acquisitionDocumentNumber'),
            purchaseDocumentDate: this._datePipe.transform(this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'date'), 'yyyy-MM-dd'),
            comment: this._appService.checkProperty(this.receiveServicesGroup.get('general').value, 'comment'),
            purchaseTypeOfService: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('namesList').value, 'serviceType'), 'name'),
            calculationTypeAah: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('namesList').value, 'calculationType'), 'name'),
            includeAahInExpense: this._appService.checkProperty(this.receiveServicesGroup.get('namesList').value, 'calculationType') ? true : false,
            formOfReflectionAah: this._appService.checkProperty(this._appService.checkProperty(this.receiveServicesGroup.get('namesList').value, 'reflectionForm'), 'name'),
            receivedServicesOperations: operationArray,
            typicalOperation: 'typical',
            date: this._datePipe.transform(this.receiveServicesGroup.get('date').value, 'yyyy-MM-dd'),
            documentNumber: this.receiveServicesGroup.get('folderNumber').value,
            receivedServicesDirectory: namesListProduct
        }
        if (this.receiveServicesGroup.valid && this._checkTabsValid()) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.receiveServicesGroup)
        }
    }
    public getActiveTab(event): void {
        this._componentDataService.onClick()
        this.activeTab = event.title;
    }
    private _checkTabsValid() {
        return this._appService.checkIsValid(this.tabsItem)
    }
    public setTodayDate(): Date {
        let today = new Date();
        return today
    }
    public setValue(event, controlName: string): void {
        this.receiveServicesGroup.get(controlName).setValue(event);
        this.onFocus(this.receiveServicesGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.receiveServicesGroup, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }

    ngOnDestroy() {
        this._loadingService.hideLoading()
        this.subscription.unsubscribe()
        this._subscription1.unsubscribe()
    }
    get error(): string {
        return this._error
    }
    get partners(): Partner[] {
        return this._partners
    }
    get analyticalGroup1(): AnalyticalGroup[] {
        return this._analyticalGroup1
    }
    get analyticalGroup2(): AnalyticalGroup[] {
        return this._analyticalGroup2
    }
    get chartAccounts(): AccountPlans[] {
        return this._chartAccounts
    }
    get unitOfMeasurements(): MaterialValues[] {
        return this._unitOfMeasurements
    }

}
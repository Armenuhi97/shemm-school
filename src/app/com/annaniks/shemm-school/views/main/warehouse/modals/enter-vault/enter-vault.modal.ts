import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { DeletedFormArrayModel, AnalyticalGroup, ServerResponse, DataCount, Partner, Types, AccountPlans, MaterialValues, ModalDataModel, OperationModel, WareHouse, ProductTypeForGetOperation, EnterVault, JsonObjectType, Classifier, GenerateType, WarehouseAcquistion, WarehouseConfig } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';
import { switchMap, map } from 'rxjs/operators';

@Component({
    selector: 'enter-vault-modal',
    templateUrl: 'enter-vault.modal.html',
    styleUrls: ['enter-vault.modal.scss']
})
export class EnterVaultModal {
    private _isSend: boolean = true
    private _subscription2: Subscription;
    public enterVaultGroup: FormGroup;
    public activeTab: string;
    public title: string;
    private _isSave: boolean = false;
    private _error: string;
    private _subscription1: Subscription;
    private _subscription: Subscription
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    private _deletedMaterialAssetsList: DeletedFormArrayModel[] = [];
    private _deletedOperation: DeletedFormArrayModel[] = [];
    public partners: Partner[] = [];
    public types: Types[] = [];
    public chartAccounts: AccountPlans[] = []
    public warehouses: WareHouse[] = [];
    public classifiers: Classifier[] = [];
    public wareHouseAcquistions: WarehouseAcquistion[] = [];
    public warehouseConfig: WarehouseConfig;
    private _lastProductArray: ProductTypeForGetOperation[] = []
    public warehouseModalParams = { tabs: ['Անվանում'], title: 'Պահեստ', keys: ['name'] }
    public unitOfMeasurements: MaterialValues[] = []
    public tabsItem = [
        { title: 'Ընդհանուր', isValid: true, key: 'general' },
        { title: 'Նյութական արժեքների ցուցակ', isValid: true, key: 'materialAssetsList' },
        { title: 'Լրացուցիչ', isValid: true, key: 'additionally' },
        { title: 'Գործառնություններ', isValid: true, key: 'operation' }]
    public typeOfAcquisition: JsonObjectType[] = []
    public calculationTypes: JsonObjectType[] = []
    constructor(private _dialogRef: MatDialogRef<EnterVaultModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject('URL_NAMES') private _urls,
        private _mainService: MainService,
        private _messageService: MessageService,
        private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _datePipe: DatePipe) {
        this.title = this._data.title;
        this._validate()
    }

    ngOnInit() {
        this._setDataFromTabs()
    }
    private setMaterialListArray(data, isSetId?: boolean): ProductTypeForGetOperation[] {

        let materailAssets: ProductTypeForGetOperation[] = []
        data.forEach((element) => {
            let el = element.value
            let object = {
                materialValueId: this._appService.checkProperty(el.code, 'id'),
                point: el.point,
                count: el.count,
                price: el.price,
                money: el.amount,
                isAah: el.isAah,
                accountsId: this._appService.checkProperty(el.account, 'id'),
                classificationId: this._appService.checkProperty(el.atgaa, 'id'),
                warehouseId: this._appService.checkProperty(el.wareHouse, 'id'),
                warehouseSignificanceId: this._appService.checkProperty(el.wareHouseAcquistion, 'id'),
                purposeExpenseAccountId: this._appService.checkProperty(el.expenceAccount, 'id')
            }
            if (!isSetId) {
                object['partnersId'] = this._appService.checkProperty(this.enterVaultGroup.get('general').value.provider, 'id');
                object['parentAAH'] = this._appService.checkProperty(this.enterVaultGroup.get('materialAssetsList').value, 'parentAAH', 0)
                // object['partnersAccountId'] = this._appService.checkProperty(this.enterVaultGroup.get('general').value.providerAccount, 'id')
            }
            // if (isSetId && el.id) {
            //     object['id'] = el.id
            // }
            materailAssets.push(object)
        })

        return materailAssets
    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {            
            if (data) {
                if (data.type == 'materialAssetsList') {
                    let materailAssets = data.data.value;
                    if (data.data.controls && data.data.controls.materialAssetsArray && data.data.controls.materialAssetsArray.controls) {
                        materailAssets['materialAssetsArray'] = data.data.controls.materialAssetsArray.controls
                        this.enterVaultGroup.get(data.type).setValue(materailAssets);
                        let products: ProductTypeForGetOperation[] = []
                        products = this.setMaterialListArray(materailAssets.materialAssetsArray);                  

                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._isSend = false
                            this._componentDataService.onIsGetOperation()
                            this._getOperationArray(products)
                        } else {
                            this._isSend = true
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setMaterialListArray(materailAssets.materialAssetsArray)

                    }
                } else {
                    this._isSend=true
                    this.enterVaultGroup.get(data.type).setValue(data.data);
                    if (data.type == 'general' && this.enterVaultGroup.get('materialAssetsList').value) {
                        let products: ProductTypeForGetOperation[] = []
                        products = this.setMaterialListArray(this.enterVaultGroup.get('materialAssetsList').value.materialAssetsArray);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._componentDataService.onIsGetOperation()
                            this._getOperationArray(products)
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setMaterialListArray(this.enterVaultGroup.get('materialAssetsList').value.materialAssetsArray)
                    }
                }

                for (let i = 0; i < this.tabsItem.length; i++) {
                    if (this.tabsItem[i].key == data.type) {
                        this.tabsItem[i].isValid = data.isValid
                    }
                }
            }
        })
    }
    private _getOperationArray(array: ProductTypeForGetOperation[]): void {
        this._mainService.getOperationArray(this._urls.warehouseEntryOrdersFunctionUrl, array, this.enterVaultGroup, this._fb, this.tabsItem)
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
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
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._mainService.getMaterialValues(),
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getWarehouseCount(),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._mainService.getCalculationTypes(),
            this._mainService.getTypeOfAcquisition(),
            this._getWareHouseAcquistionCount(),
            this._getClassifierCount(),
            this._getWarehouseConfig()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this.partners = this._oftenUsedParamsService.getPartners();
            this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this.unitOfMeasurements = this._oftenUsedParamsService.getMaterialValues();
            this.warehouses = this._oftenUsedParamsService.getWarehouse();
            this.calculationTypes = this._oftenUsedParamsService.getCalculationTypes();
            this.typeOfAcquisition = this._oftenUsedParamsService.getTypeOfAcquisition()
            if (data) {
                this._getEnterVaultById()
            }
        })
    }
    private _getWarehouseConfig() {
        return this._mainService.getByUrlWithoutLimit(this._urls.wareHouseJsonUrl).pipe(
            map((data: ServerResponse<WarehouseConfig>) => {
                this.warehouseConfig = data.data;
                return data
            })
        )
    }
    private _getWareHouseAcquistionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.warehouseSignificancesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getWareHouseAcquistion(data.data.count)
            })
        )
    }
    private _getWareHouseAcquistion(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.warehouseSignificancesMainUrl, count, 0).pipe(
            map((data: ServerResponse<WarehouseAcquistion[]>) => {
                this.wareHouseAcquistions = data.data;
            })
        )
    }
    private _generateDocumentNumber(): void {
        this._mainService.generateField('warehouse_entry_order', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
            this.enterVaultGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })

    }
    private _getClassifierCount(): Observable<void> {
        return this._mainService.getCount(this._urls.classifierMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getClassifier(data.data.count)
            })
        )
    }
    private _getClassifier(limit: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.classifierMainUrl, limit, 0).pipe(
            map((data: ServerResponse<Classifier[]>) => {
                this.classifiers = data.data;
            })
        )
    }
    private _setCalculateType(calculateType, isIncludeAahInCost):number {
        let parentAAH = 0;
        if (calculateType) {
            if (calculateType.id == 1) {
                let aahValue = isIncludeAahInCost ? 2 : 1
                parentAAH = aahValue
            } else {
                if (calculateType.id == 2) {
                    let aahValue = isIncludeAahInCost ? 0 : 2
                    parentAAH = aahValue

                } else {
                    parentAAH = 0
                }
            }
        }
        return parentAAH
    }
    private _getEnterVaultById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<EnterVault>) => {

                if (data) {
                    let enterVault = data.data;
                    let productArray = [];
                    enterVault.warehouseEntryOrderProduct.forEach((element) => {
                        productArray.push(this._fb.group({
                            code: element.materialValue,
                            name: (element && element.materialValue) ? element.materialValue.name : null,
                            point: (element && element.point) ? element.point : 0,
                            count: (element && element.count) ? element.count : 0,
                            price: (element && element.price) ? element.price : 0,
                            amount: (element && element.money) ? element.money : 0,
                            isAah: this._appService.getBooleanVariable(element.isAah),
                            account: element.accounts,
                            atgaa: element.classification,
                            // id: (element && element.id) ? element.id : null,
                            wareHouse: element.warehouseId ? this._appService.checkProperty(this._appService.filterArray(this.warehouses, element.warehouseId, 'id'), 0) : null,
                            wareHouseAcquistion: this._appService.checkProperty(element, 'warehouseSignificance'),
                            expenceAccount: element.purposeExpenseAccountId ? this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, element.purposeExpenseAccountId, 'id'), 0) : null,
                        }))
                    })
                    this._oftenUsedParamsService.setPreviousValue(enterVault.warehouseSignificanceId);
                    let calculateType = this._appService.checkProperty(this._appService.filterArray(this.calculationTypes,
                        enterVault.calculationStyleOfAah, 'name'), '0');

                    this.enterVaultGroup.patchValue({
                        date: enterVault.date ? new Date(enterVault.date) : enterVault.date,
                        folderNumber: enterVault.documentNumber,
                        warehouse: enterVault.warehouse,
                        wareHouseAcquistion: this._appService.checkProperty(this._appService.filterArray(this.wareHouseAcquistions, enterVault.warehouseSignificanceId, 'id'), 0),
                        general: {
                            provider: enterVault.partners,
                            // name: null,
                            analyticalGroup1: enterVault.analiticGroup1,
                            analyticalGroup2: enterVault.analiticGroup2,
                            acquisitionDocumentNumber: enterVault.documentN,
                            date: enterVault.documentDate ? new Date(enterVault.documentDate) : null,
                            comment: enterVault.comment,
                            // providerAccount: enterVault.partnersAccount,
                            // prepaymentAccountReceived: enterVault.prepaidAccount,
                            // givenAdvancePaymentAccount: ,
                        },
                        materialAssetsList: {
                            // acquisitionType: this._appService.checkProperty(this._appService.filterArray(this.typeOfAcquisition,
                            //     enterVault.typeOfAcquisitionOfNa, 'name'), '0'),
                            calculationType: calculateType,

                            isIncludeAahInCost: this._appService.getBooleanVariable(enterVault.includeAahInCost),
                            parentAAH: this._setCalculateType(calculateType,enterVault.includeAahInCost),
                            // calculateType && calculateType.id ? (calculateType.id == 1 || calculateType.id == 2) ? calculateType.id : 0 : 0,
                            materialAssetsArray: productArray
                        },
                        additionally: {
                            proxy: enterVault.powerOfAttorney,
                            intermediary: enterVault.mediator,
                            carType: enterVault.container,
                            chiefAccountant: enterVault.accountant,
                            allowed: enterVault.allow,
                            taken: enterVault.accept,
                            transportDocumentationNumber: enterVault.documentOfTransport,
                            date: enterVault.documentOfTransportDate ? new Date(enterVault.documentOfTransportDate) : null

                        },
                        operation: this._mainService.setOperationArray(enterVault.warehouseEntryOrderOperation, this._fb)
                    })

                    this._lastProductArray = this.setMaterialListArray(productArray);                    
                    this._loadingService.hideLoading()
                }
            }
            )
        } else {
            this.enterVaultGroup.get('date').setValue(this.setTodayDate());
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
        this.enterVaultGroup = this._fb.group({
            date: [null, Validators.required],
            folderNumber: [null, Validators.required],
            warehouse: [null],
            wareHouseAcquistion: [null],
            general: [null],
            materialAssetsList: [null, Validators.required],
            additionally: [null],
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
                if (!data.isGet) {
                    this._subscription2.unsubscribe()
                    this.sendData()

                }
            })
        }
    }
    public sendData(): void {
        let materailAssets = [];
        if (this.enterVaultGroup.get('materialAssetsList') && this.enterVaultGroup.get('materialAssetsList').value && this.enterVaultGroup.get('materialAssetsList').value.materialAssetsArray) {
            materailAssets = this.setMaterialListArray(this.enterVaultGroup.get('materialAssetsList').value.materialAssetsArray, true)
        }

        let operationArray = []
        if (this.enterVaultGroup.get('operation') && this.enterVaultGroup.get('operation').value) {
            this.enterVaultGroup.get('operation').value.forEach((element) => {
                let data = element.value
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }

        this._appService.markFormGroupTouched(this.enterVaultGroup);

        let sendObject = {
            date: this._datePipe.transform(this.enterVaultGroup.get('date').value, 'yyyy-MM-dd'),
            documentNumber: this.enterVaultGroup.get('folderNumber').value,
            warehouseId: this._appService.checkProperty(this.enterVaultGroup.get('warehouse').value, 'id'),
            warehouseSignificanceId: this._appService.checkProperty(this.enterVaultGroup.get('wareHouseAcquistion').value, 'id'),
            partnersId: this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'provider'),
                'id'),
            partnersAccountId: null,
            //  this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'providerAccount'),
            //     'id'),
            prepaidAccountId: null,
            //  this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'prepaymentAccountReceived'),
            //     'id'),
            // prepaidAccountId: this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'givenAdvancePaymentAccount'),
            //     'id'),
            analiticGroup_2Id: this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'analyticalGroup2'),
                'id'),
            analiticGroup_1Id: this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'analyticalGroup1'),
                'id'),
            name: null,
            //  this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'name'),
            documentN: this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'acquisitionDocumentNumber'),
            documentDate: this._datePipe.transform(this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'date'), 'yyyy-MM-dd'),
            comment: this._appService.checkProperty(this.enterVaultGroup.get('general').value, 'comment'),
            powerOfAttorney: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'proxy'),
            mediator: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'intermediary'),
            container: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'carType'),
            accountant: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'chiefAccountant'),
            allow: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'allowed'),
            accept: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'taken'),
            documentOfTransport: this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'transportDocumentationNumber'),
            documentOfTransportDate: this._datePipe.transform(this._appService.checkProperty(this.enterVaultGroup.get('additionally').value, 'date'), 'yyyy-MM-dd'),
            typeOfAcquisitionOfNa: null,
            // this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('materialAssetsList').value, 'acquisitionType'), 'name'),
            calculationStyleOfAah: this._appService.checkProperty(this._appService.checkProperty(this.enterVaultGroup.get('materialAssetsList').value, 'calculationType'), 'name'),
            includeAahInCost: this._appService.checkProperty(this.enterVaultGroup.get('materialAssetsList').value, 'isIncludeAahInCost') ? true : false,
            warehouseEntryOrderProduct: materailAssets,
            warehouseEntryOrderFunctions: operationArray
        }

        if (this.enterVaultGroup.valid) {
            this._loadingService.showLoading()
            if (!this._data.id) {
                this._add(sendObject)
            } else {
                this._mainService.deleteByUrl(this._data.url, this._data.id).subscribe((data) => {
                    if (data) {
                        this._add(sendObject)
                    }

                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            }

        } else {
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.enterVaultGroup)

        }

    }
    private _add(sendObject) {
        this._mainService.addByUrl(this._urls.warehouseEntryOrderGetOneUrl, sendObject).subscribe((data) => {
            this._componentDataService.offClick();
            this._dialogRef.close({ value: true });
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

    public setValue(event, controlName): void {
        this.enterVaultGroup.get(controlName).setValue(event);
        this.onFocus(this.enterVaultGroup, controlName)

    }

    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.enterVaultGroup, controlName, property)
    }

    public setModalParams(title: string, tabs: Array<string>, properties: Array<string>) {
        let modalParams = { tabs: tabs, title: title, keys: properties };
        return modalParams
    }

    ngOnDestroy() {
        this._loadingService.hideLoading()
        if (this._subscription2) {
            this._subscription2.unsubscribe()
        }
        this._oftenUsedParamsService.setPreviousValue(null)
        this._subscription1.unsubscribe();
        this._subscription.unsubscribe();
    }

    get error(): string {
        return this._error
    }
}
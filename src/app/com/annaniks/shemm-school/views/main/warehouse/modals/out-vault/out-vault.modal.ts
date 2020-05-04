import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AnalyticalGroup, DeletedFormArrayModel, Partner, Types, AccountPlans, MaterialValues, ModalDataModel, ServerResponse, OperationModel, DataCount, WareHouse, Subsection, ExitVault, GenerateType, WarehouseAcquistion } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { AppService, ComponentDataService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';
import { ExitOrderService } from '../../pages/exit-order/exit-order.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'out-vault-modal',
    templateUrl: 'out-vault.modal.html',
    styleUrls: ['out-vault.modal.scss']
})
export class OutVaultModal {
    private _isSend: boolean = true
    public exitSpecification = []
    private _subscription2: Subscription;
    public outVaultGroup: FormGroup;
    public activeTab: string;
    public title: string;
    private _error: string;
    private _lastProductArray = []
    private _subscription1: Subscription;
    private _subscription: Subscription
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    private _deletedProducts: DeletedFormArrayModel[] = [];
    private _deletedOperation: DeletedFormArrayModel[] = [];
    public partners: Partner[] = [];
    public wareHouseAcquistions: WarehouseAcquistion[] = []
    public types: Types[] = [];
    public chartAccounts: AccountPlans[] = []
    public warehouses: WareHouse[] = [];
    public subsection: Subsection[] = [];
    public warehouseModalParams = { tabs: ['Կոդ', 'Անվանում'], title: 'Պահեստ', keys: ['code', 'name'] }
    public unitOfMeasurements: MaterialValues[] = []
    public tabsItem = [{ title: 'Ընդհանուր', isValid: true, key: 'general' },
    { title: 'Լրացուցիչ', isValid: true, key: 'additionally' },
    { title: 'Գործառնություններ', isValid: true, key: 'operation' }]

    constructor(private _dialogRef: MatDialogRef<OutVaultModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject('URL_NAMES') private _urls,
        private _mainService: MainService,
        private _fb: FormBuilder,
        private _messageService: MessageService,
        private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _loadingService: LoadingService,
        private _datePipe: DatePipe,
        private _exitOrderService: ExitOrderService,
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
                materialValueId: this._appService.checkProperty(data.code, 'id'),
                count: data.quantity,
                money: data.amount,
                warehouseId: this._appService.checkProperty(data.wareHouse, 'id'),
                warehouseSignificanceId: this._appService.checkProperty(data.wareHouseAcquistion, 'id'),

            }
            if (isSetId) {
                // if (data.id)
                //     object['id'] = data.id
            } else {
                object['isAah'] = false
            }
            materailAssets.push(object)
        })
        return materailAssets
    }

    private _setDataFromTabs(): void {

        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'general') {
                    let materailAssets = data.data.value;
                    this.outVaultGroup.get(data.type).setValue(materailAssets);
                    if (data.data.controls && data.data.controls.productArray && data.data.controls.productArray.controls) {
                        materailAssets['productArray'] = data.data.controls.productArray.controls;
                        materailAssets['productArray'].forEach((val) => {
                            let value = val.value
                            value.groupCount = value.groupCount.controls
                            value.allGroupArrays = value.allGroupArrays.controls
                        })

                        this.outVaultGroup.get(data.type).setValue(materailAssets);

                        let products = []
                        products = this.setMaterialListArray(materailAssets.productArray);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._isSend = false
                            this._componentDataService.onIsGetOperation()
                            this._getOperationArray(products)
                        }
                        else {
                            this._isSend = true
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setMaterialListArray(materailAssets.productArray)

                    }
                } else {
                    this._isSend=true
                    this.outVaultGroup.get(data.type).setValue(data.data);
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

    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.warehouseExitOrdersFunctionUrl, body, this.outVaultGroup, this._fb, this.tabsItem)

    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
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
            this._getWareHouseAcquistionCount()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this.partners = this._oftenUsedParamsService.getPartners();
            this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this.unitOfMeasurements = this._oftenUsedParamsService.getMaterialValues();
            this.warehouses = this._oftenUsedParamsService.getWarehouse()
            if (data) {
                this._getExitVaultById()
            }
        })
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
        this._mainService.generateField('warehouse_exit_order', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
            this.outVaultGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => this._loadingService.hideLoading())
    }

    private _getExitVaultById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<ExitVault>) => {

                if (data) {
                    let exitVault = data.data;
                    this.exitSpecification = []
                    let productArray = [];
                    exitVault.warehouseExitOrderProduct.forEach((element) => {
                        let array = [];
                        let count = 0
                        element.exitSpecification.forEach((val) => {
                            count += val.count
                            val['warehouseSignificanceId']=element.warehouseSignificanceId
                            val['warehouseId']=element.warehouseId
                            this.exitSpecification.push(val)
                            val['accounts'] = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, val.accountsId, 'id'), 0)
                            val['availability'] = val.count
                            val['calculateCount'] = new FormControl(val.quantity, [Validators.max(val.count), Validators.min(0)])
                            array.push(this._fb.group(val))
                        })

                        let obj = {

                            code: element.materialValue,
                            name: (element && element.materialValue) ? element.materialValue.name : null,
                            point: (element && element.point) ? element.point : 0,
                            quantity: this._fb.control((element && element.count) ? element.count : 0, [Validators.max(count), Validators.min(0)]),
                            // (element && element.count) ? element.count : 0,
                            amount: (element && element.money) ? element.money : 0,
                            groupCount: this._fb.array(array),
                            groupText: null,
                            availability: count,
                            allGroupArrays: this._fb.array(array),
                            id: (element && element.id) ? element.id : null,
                            materialValuesArray: null,
                            wareHouse: element.warehouseId ? this._appService.checkProperty(this._appService.filterArray(this.warehouses, element.warehouseId, 'id'), 0) : null,
                            wareHouseAcquistion: this._appService.checkProperty(element, 'warehouseSignificance'),

                        }
                        productArray.push(this._fb.group(obj))

                    })
                    this._oftenUsedParamsService.setPreviousValue(exitVault.warehouseId);
                    this._oftenUsedParamsService.setPreviousValue2(exitVault.warehouseSignificanceId)
                    this.outVaultGroup.patchValue({
                        date: new Date(exitVault.date),
                        folderNumber: exitVault.documentNumber,
                        warehouse: exitVault.warehouse,
                        wareHouseAcquistion: this._appService.checkProperty(this._appService.filterArray(this.wareHouseAcquistions, exitVault.warehouseSignificanceId, 'id'), 0),

                        general: {
                            expenseAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, exitVault.expenseAccountId, 'account'), 0),
                            analyticalGroup1: this._appService.checkProperty(exitVault, 'analiticGroup1'),
                            analyticalGroup2: this._appService.checkProperty(exitVault, 'analiticGroup2'),
                            comment: exitVault.comment,
                            productArray: productArray
                        },
                        additionally: {
                            proxy: exitVault.powerOfAttorney,
                            intermediary: exitVault.mediator,
                            carType: exitVault.container,
                            chiefAccountant: exitVault.accountant,
                            allowed: exitVault.allow,
                            demanded: exitVault.hasRequested
                        },
                        operation: this._mainService.setOperationArray(exitVault.warehouseExitOrderOperation, this._fb)

                    })
                    this._lastProductArray = this.setMaterialListArray(productArray)
                    this._loadingService.hideLoading()
                }
            })
        } else {
            this.outVaultGroup.get('date').setValue(this.setTodayDate());
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
        this.outVaultGroup = this._fb.group({
            date: [null, Validators.required],
            folderNumber: [null, Validators.required],
            warehouse: [null],
            wareHouseAcquistion: [null],
            general: [null],
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
                this._subscription2.unsubscribe()
                if (!data.isGet) {
                    this.sendData()
                }
            })
        }
    }
    public sendData(): void {
        let materailAssets = [];
        let batchs = []
        if (this.outVaultGroup.get('general') && this.outVaultGroup.get('general').value && this.outVaultGroup.get('general').value.productArray) {
            materailAssets = this.setMaterialListArray(this.outVaultGroup.get('general').value.productArray, true);
            this.outVaultGroup.get('general').value.productArray.forEach((product) => {
                // let array = product.get("groupCount").value;
                let array = (product.get("groupCount").value && product.get("groupCount").value.value) ? product.get("groupCount").value.value : product.get("groupCount").value;

                array.forEach((value) => {
                    batchs.push({
                        warehouseEntryOrderProductId: this._appService.checkProperty(value, 'warehouseEntryOrderProductId', value.id),
                        warehouseEntryOrderId: value.warehouseEntryOrderId,
                        materialValueId: value.materialValueId,
                        quantity: (value.calculateCount && value.calculateCount.value) ? value.calculateCount.value : value.calculateCount
                    })
                })


            })
        }

        let operationArray = []
        if (this.outVaultGroup.get('operation') && this.outVaultGroup.get('operation').value) {
            this.outVaultGroup.get('operation').value.forEach((element) => {
                let data = element.value
                let object = this._appService.getOperationObject(data)

                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.outVaultGroup);

        let sendObject = {
            date: this._datePipe.transform(this.outVaultGroup.get('date').value, 'yyyy-MM-dd'),
            warehouseId: this._appService.checkProperty(this.outVaultGroup.get('warehouse').value, 'id'),
            warehouseSignificanceId: this._appService.checkProperty(this.outVaultGroup.get('wareHouseAcquistion').value, 'id'),

            expenseAccountId: this._appService.checkProperty(this._appService.checkProperty(this.outVaultGroup.get('general').value, 'expenseAccount'),
                'account'),
            documentNumber: this.outVaultGroup.get('folderNumber').value,
            analiticGroup_2Id: this._appService.checkProperty(this._appService.checkProperty(this.outVaultGroup.get('general').value, 'analyticalGroup2'),
                'id'),
            analiticGroup_1Id: this._appService.checkProperty(this._appService.checkProperty(this.outVaultGroup.get('general').value, 'analyticalGroup1'),
                'id'),
            comment: this._appService.checkProperty(this.outVaultGroup.get('general').value, 'comment'),
            powerOfAttorney: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'proxy'),
            mediator: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'intermediary'),
            container: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'carType'),
            accountant: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'chiefAccountant'),
            allow: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'allowed'),
            hasRequested: this._appService.checkProperty(this.outVaultGroup.get('additionally').value, 'demanded'),
            warehouseExitOrderProduct: materailAssets,
            exitSpecification: batchs,
            warehouseExitOrderFunctions: operationArray
        }
        console.log(JSON.stringify(sendObject));
        
        if (this.outVaultGroup.valid) {
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

            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.outVaultGroup)
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
    public setValue(event, controlName:string): void {
        this.outVaultGroup.get(controlName).setValue(event);
        this.onFocus(this.outVaultGroup, controlName)
    }

    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.outVaultGroup, controlName, property)
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
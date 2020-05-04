import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { LoadingService, ComponentDataService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { ServerResponse, DataCount, Partner, AnalyticalGroup, DeletedFormArrayModel, Subsection, WareHouse, ModalDataModel, ProductTypeForGetOperation, AccountPlans, Types, OperationModel, MaterialValues, JsonObjectType, GenerateType, WarehouseAcquistion, WarehouseConfig } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map, switchMap } from 'rxjs/operators';
import { MainService } from '../../../main.service';
import { AddPartnerModal } from '../../../main-accounting/modals';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'invoice-modal',
    templateUrl: 'invoice.modal.html',
    styleUrls: ['invoice.modal.scss']
})
export class InvoiceModal {
    private _subscription2: Subscription;
    private _isSend: boolean = true;
    public wareHouseAcquistions: WarehouseAcquistion[] = []
    public exitSpecification = []
    public warehouseConfig: WarehouseConfig;
    public title: string;
    public invoiceGroup: FormGroup;
    public activeTab: string;
    public materialValues: MaterialValues[] = [];
    public tabsItem = [{ title: 'Ընդհանուր', isValid: true, key: 'general' },
    { title: 'Անվանացուցակ', isValid: true, key: 'namesList' },
    { title: 'Գործառնություններ', isValid: true, key: 'operation' }]
    private _subscription: Subscription;
    private _error: string;
    private _subscription1: Subscription;
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private _group1 = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2 = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    public warehouses: WareHouse[] = []
    public subsection: Subsection[] = [];
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    private _lastProductArray = [];
    public calculationTypes: JsonObjectType[] = []
    public types = [{ code: 1, name: 'Նյութական արժեքներ' }, { code: 2, name: 'Ծառայություն' }]
    constructor(private _dialogRef: MatDialogRef<InvoiceModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _loadingService: LoadingService,
        private _messageService: MessageService,
        private _matDialog: MatDialog,
        private _mainService: MainService,
        private _componentDataService: ComponentDataService,
        private _fb: FormBuilder,
        private _appService: AppService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls
    ) {
        this._validate();

    }
    ngOnInit() {
        this._setDataFromTabs()
        this.title = this._data.title;
    }

    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.invoiceFunctionUrl, body, this.invoiceGroup, this._fb, this.tabsItem)

    }
    private setNamesListArray(data, isSetId?: boolean) {
        let namesListProduct = []
        data.forEach((element) => {
            let data = element.value;
            let object = {
                materialValueId: this._appService.checkProperty(data.code, 'id'),
                count: data.quantity,
                money: data.amount,
                warehouseId: this._appService.checkProperty(data.wareHouse, 'id'),
                // warehouseSignificanceId: this._appService.checkProperty(data.wareHouseAcquistion, 'id'),
                // isAah: data.isAah,
                // price: data.price,

            }
            if (!isSetId) {
                object['partnerId'] = this._appService.checkProperty(this.invoiceGroup.get('buyer').value, 'id')
                object['price'] = data.price;
                object['aahPrice'] = data.aahPrice
                object['moneyGroup'] = data.groupAmount;
                object['isAah'] = data.isAah;
                object['warehouseSignificanceId'] = this._appService.checkProperty(data.wareHouseAcquistion, 'id');
                object['parentAAH'] = this._appService.checkProperty(this.invoiceGroup.get('namesList').value, 'parentAAH', 0)
            }
            namesListProduct.push(object)
        })
        return namesListProduct

    }
    private _setDataFromTabs() {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'namesList') {

                    let materailAssets = data.data.value;
                    this.invoiceGroup.get(data.type).setValue(materailAssets);
                    if (data.data.controls && data.data.controls.productArray && data.data.controls.productArray.controls) {
                        materailAssets['productArray'] = data.data.controls.productArray.controls;
                        materailAssets['productArray'].forEach((val) => {
                            let value = val.value
                            value.groupCount = value.groupCount.controls
                            value.allGroupArrays = value.allGroupArrays.controls
                        })

                        this.invoiceGroup.get(data.type).setValue(materailAssets);

                        let products = []
                        products = this.setNamesListArray(materailAssets.productArray);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._isSend = false
                            this._componentDataService.onIsGetOperation()
                            this._getOperationArray(products)
                        }
                        else {
                            this._isSend = true
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setNamesListArray(materailAssets.productArray)

                    }


                } else {
                    this._isSend = true
                    this.invoiceGroup.get(data.type).setValue(data.data);
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
    public close(): void {
        this._dialogRef.close();
        this._componentDataService.offClick()
    }
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getSubsectionCount(),
            // this._getTypesCount(),
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getWarehouseCount(),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._mainService.getWarehouseCount(),
            this._mainService.getMaterialValues(),
            this._getWareHouseAcquistionCount(),
            this._getWarehouseConfig(),
            this._mainService.getCalculationTypes()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this.partners = this._oftenUsedParamsService.getPartners();
            this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this.warehouses = this._oftenUsedParamsService.getWarehouse();
            this.materialValues = this._oftenUsedParamsService.getMaterialValues()
            this.calculationTypes = this._oftenUsedParamsService.getCalculationTypes()
            if (data) {
                this._getInvoiceById()
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
    private _getInvoiceById() {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<any>) => {
                if (data) {
                    let invoice = data.data;
                    this.exitSpecification = []
                    let productArray = [];
                    invoice.accountInvoiceProduct.forEach((element) => {
                        let array = [];
                        let count = 0
                        if (element.accountInvoiceSpecification)
                            element.accountInvoiceSpecification.forEach((val) => {
                                count += val.count
                                this.exitSpecification.push(val)
                                val['accounts'] = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, val.accountsId, 'id'), 0)
                                val['availability'] = val.count
                                val['calculateCount'] = new FormControl(val.quantity, [Validators.max(val.count), Validators.min(0)])
                                array.push(this._fb.group(val))
                            })

                        let obj = {
                            price: element.price,
                            isAah: element.isAah,
                            expenseAccount: element.expenseAccount,
                            incomeAccount: element.incomeAccount,
                            code: element.materialValue,
                            quantity: this._fb.control((element && element.count) ? element.count : 0, [Validators.max(count), Validators.min(0)]),
                            amount: (element && element.money) ? element.money : 0,
                            groupCount: this._fb.array(array),
                            groupText: null,
                            availability: count,
                            allGroupArrays: this._fb.array(array),
                            materialValuesArray: null,
                            wareHouse: element.warehouseId ? this._appService.checkProperty(this._appService.filterArray(this.warehouses, element.warehouseId, 'id'), 0) : null,
                            wareHouseAcquistion: this._appService.checkProperty(element, 'warehouseSignificance'),

                        }
                        productArray.push(this._fb.group(obj))

                    })
                    this._oftenUsedParamsService.setPreviousValue(invoice.warehouseId);
                    this._oftenUsedParamsService.setPreviousValue2(invoice.warehouseSignificanceId)
                    this.invoiceGroup.patchValue({
                        date: new Date(invoice.date),
                        folderNumber: invoice.documentNumber,
                        warehouse: invoice.warehouse,
                        warehouseAcquistion: this._appService.checkProperty(this._appService.filterArray(this.wareHouseAcquistions, invoice.warehouseSignificanceId, 'id'), 0),

                        buyer: this._appService.checkProperty(invoice, 'partner'),
                        barcode: invoice.lineCode,
                        general: {
                            contract: invoice.contract,
                            contractDate: invoice.contractDate ? new Date(invoice.contractDate) : null,
                            subsection: this._appService.checkProperty(invoice, 'subsection'),
                            series: invoice.seria,
                            number: invoice.number,
                            dischargeDate: invoice.dateOfDischarge ? new Date(invoice.dateOfDischarge) : null,
                            expenseAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, invoice.expenseAccountId, 'account'), 0),
                            analyticalGroup1: this._appService.checkProperty(invoice, 'analiticGroup1'),
                            analyticalGroup2: this._appService.checkProperty(invoice, 'analiticGroup2'),
                            comment: invoice.comment,
                            productArray: productArray
                        },
                        namesList: productArray,
                        operation: this._mainService.setOperationArray(invoice.accountInvoiceFunction, this._fb)

                    })
                    this._lastProductArray = this.setNamesListArray(productArray)
                    this._loadingService.hideLoading()
                }
            })
        } else {
            this.invoiceGroup.get('date').setValue(this.setTodayDate());
            this._generateDocumentNumber()
        }
    }
    private _generateDocumentNumber(): void {
        this._mainService.generateField('account_invoice', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
            this.invoiceGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => this._loadingService.hideLoading())
    }
    private _getSubsectionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.subsectionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                let count = data.data.count;
                return this._getSubvision(count);
            })
        )

    }
    private _getSubvision(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.subsectionMainUrl, count, 0).pipe(
            map((data: ServerResponse<Subsection[]>) => {
                this.subsection = data.data;
            })
        )
    }


    private _validate() {
        this.invoiceGroup = this._fb.group({
            date: [null, Validators.required],
            folderNumber: [null, Validators.required],
            warehouse: [null],
            warehouseAcquistion: [null],
            buyer: [null],
            barcode: [null],
            general: [null],
            namesList: [null],
            operation: [null],

        })
        this._combineObservable()
    }
    public addBuyer() {
        this._subscription1.unsubscribe();
        let title = 'Գնորդ (Նոր)';
        let dialog = this._matDialog.open(AddPartnerModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            data: { title: title, url: this._urls.partnerGetOneUrl },
            autoFocus: false
        })
        dialog.afterClosed().subscribe((data) => {
            this._setDataFromTabs()
            if (data) {
                if (data.value) {
                    this._loadingService.showLoading()
                    this._mainService.getPartnerCount().subscribe(() => {
                        this.partners = this._oftenUsedParamsService.getPartners();
                        this._loadingService.hideLoading();
                    })

                }
            }
        })
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
    public sendData() {
        // let namesList = [];
        // if (this.invoiceGroup.get('namesList') && this.invoiceGroup.get('namesList').value && this.invoiceGroup.get('namesList').value.product) {
        //     let element = this.invoiceGroup.get('namesList').value.product;
        //     namesList = this.setNamesListArray(element)
        // }
        let materailAssets = [];
        let batchs = []
        if (this.invoiceGroup.get('namesList') && this.invoiceGroup.get('namesList').value && this.invoiceGroup.get('namesList').value.productArray) {
            materailAssets = this.setNamesListArray(this.invoiceGroup.get('namesList').value.productArray, true);
            this.invoiceGroup.get('namesList').value.productArray.forEach((product) => {
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
        if (this.invoiceGroup.get('operation') && this.invoiceGroup.get('operation').value) {
            this.invoiceGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.invoiceGroup);
        let sendObject = {
            date: this._datePipe.transform(this.invoiceGroup.get('date').value, 'yyyy-MM-dd'),
            ///
            // warehouseId: this._appService.checkProperty(this.invoiceGroup.get('warehouse').value, 'id'),
            // warehouseSignificanceId: this._appService.checkProperty(this.invoiceGroup.get('warehouseAcquistion').value, 'id'),
            partnerId: this._appService.checkProperty(this.invoiceGroup.get('buyer').value, 'id'),
            lineCode: this.invoiceGroup.get('barcode').value,
            documentNumber: this.invoiceGroup.get('folderNumber').value,
            contract: this._appService.checkProperty(this.invoiceGroup.get('general').value, 'contract'),
            contractDate: this._datePipe.transform(this._appService.checkProperty(this.invoiceGroup.get('general').value, 'contractDate'), 'yyyy-MM-dd'),
            subsectionId: this._appService.checkProperty(this._appService.checkProperty(this.invoiceGroup.get('general').value, 'subsection'), 'id'),
            seria: this._appService.checkProperty(this.invoiceGroup.get('general').value, 'series'),
            number: this._appService.checkProperty(this.invoiceGroup.get('general').value, 'number'),
            dateOfDischarge: this._datePipe.transform(this._appService.checkProperty(this.invoiceGroup.get('general').value, 'dischargeDate'), 'yyyy-MM-dd'),
            analiticGroup_2Id: this._appService.checkProperty(this._appService.checkProperty(this.invoiceGroup.get('general').value, 'analyticalGroup2'),
                'id'),
            analiticGroup_1Id: this._appService.checkProperty(this._appService.checkProperty(this.invoiceGroup.get('general').value, 'analyticalGroup1'),
                'id'),
            comment: this._appService.checkProperty(this.invoiceGroup.get('general').value, 'comment'),
            /////
            // calculationTypes: this._appService.checkProperty(this._appService.checkProperty(this.invoiceGroup.get('namesList').value, 'calculationTypes'), 'name'),
            accountInvoiceProduct: materailAssets,
            accountInvoiceSpecification: batchs,
            accountInvoiceFunction: operationArray
        }
        // console.log(JSON.stringify(sendObject));


        if (this.invoiceGroup.valid) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.invoiceGroup);
            this._componentDataService.offClick();
        }
        // this._componentDataService.offClick();
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
    public getActiveTab(event): void {
        this._componentDataService.onClick()
        this.activeTab = event.title;
    }
    public setTodayDate(): Date {
        let today = new Date();
        return today
    }
    public setValue(event, controlName: string) {
        this.invoiceGroup.get(controlName).setValue(event);
        if (controlName == 'buyer' && this.invoiceGroup.get('namesList').value) {
            let products: ProductTypeForGetOperation[] = []
            products = this.setNamesListArray(this.invoiceGroup.get('namesList').value.productArray);
            if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                this._componentDataService.onIsGetOperation()
                this._getOperationArray(products)
            }
            this._lastProductArray = []
            this._lastProductArray = this.setNamesListArray(this.invoiceGroup.get('namesList').value.productArray)
        }
        this.onFocus(this.invoiceGroup, controlName)
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.invoiceGroup, controlName, property)
    }
    public setModalParams(title: string, tabs: Array<string>, keys: Array<string>) {
        let modalParams = { tabs: tabs, title: title, keys: keys };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }

    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe();
        if (this._subscription2) {
            this._subscription2.unsubscribe()
        }
        this._oftenUsedParamsService.setPreviousValue(null)
        this._oftenUsedParamsService.setPreviousValue2(null);
        this._subscription1.unsubscribe()
    }

}
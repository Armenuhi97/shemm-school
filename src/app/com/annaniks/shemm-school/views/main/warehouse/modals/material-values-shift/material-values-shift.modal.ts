import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDataModel, ServerResponse, DataCount, ExitVaults, EnterVault, AnalyticalGroup, Partner, AccountPlans, WareHouse, MaterialValues, DeletedFormArrayModel, OperationModel, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { MainService } from '../../../main.service';
import { switchMap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'metrial-values-shift-modal',
    templateUrl: 'material-values-shift.modal.html',
    styleUrls: ['material-values-shift.modal.scss']
})
export class MaterialValuesShiftModal {
    public title: string;
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public materialValuesGroup: FormGroup;
    public activeTab: string;
    public exitVaults: ExitVaults[] = [];
    private _deletedProducts: DeletedFormArrayModel[] = [];
    private _deletedOperation: DeletedFormArrayModel[] = [];;
    public enterVaults: EnterVault[] = []
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    public warehouses: WareHouse[] = [];
    public unitOfMeasurements: MaterialValues[] = [];
    private _subscription1: Subscription;
    private _lastProductArray = []

    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Լրացուցիչ', key: 'additionally', isValid: true },
        { title: 'Գործառնություններ', key: 'operation', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<MaterialValuesShiftModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _messageService: MessageService,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
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
    private setMaterialListArray(data) {
        let materailAssets = []
        data.forEach((element) => {
            let el = element.value
            let object = {
                materialValueId: el.materialValuesId,
                point: el.point,
                count: el.count,
                price: el.price,
                money: el.amount,
            }
            materailAssets.push(object)
        })

        return materailAssets
    }
    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.materialValuesShiftFunctionUrl, body, this.materialValuesGroup, this._fb, this.tabsItem)

    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'general') {
                    let materailAssets = data.data.value;
                    if (data.data.controls && data.data.controls.productArray && data.data.controls.productArray.controls) {
                        materailAssets['productArray'] = data.data.controls.productArray.controls
                        this.materialValuesGroup.get(data.type).setValue(materailAssets);
                        let products = []
                        products = this.setMaterialListArray(materailAssets.productArray);
                        if (!this._appService.checkIsChangeProductArray(products, this._lastProductArray)) {
                            this._getOperationArray(products)
                        }
                        this._lastProductArray = []
                        this._lastProductArray = this.setMaterialListArray(materailAssets.productArray)

                    }
                    if (data.isDeletedArray && data.isDeletedArray.length)
                        data.isDeletedArray.forEach(element => {
                            this._deletedProducts.push(element)
                        });

                } else {
                    this.materialValuesGroup.get(data.type).setValue(data.data);
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
    public close() {
        this._dialogRef.close()
    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getExitVaultCount(),
            this._getEnterVaultCount(),
            this._mainService.getMaterialValues(),
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getWarehouseCount(),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
            this.warehouses = this._oftenUsedParams.getWarehouse();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this.unitOfMeasurements = this._oftenUsedParams.getMaterialValues();
            this._generateFolderNumber()
        })
    }
    private _generateFolderNumber(): void {
        if (!this._data.id) {
            this._mainService.generateField(this._data.url, 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
                this.materialValuesGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
                this._loadingService.hideLoading()
            },
                () => {
                    this._loadingService.hideLoading()
                })
        } else {
            this._loadingService.hideLoading()

        }
    }
    private _validate() {
        this.materialValuesGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            warehouseenter: [null, Validators.required],
            warehouseout: [null, Validators.required],
            general: [null],
            additionally: [null],
            operation: [null]
        })
        this._combineObservable()
    }

    private _getExitVaultCount(): Observable<void> {
        return this._mainService.getCount(this._urls.warehouseExitOrderMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getExitVault(data.data.count)
            })
        )
    }
    private _getExitVault(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.warehouseExitOrderMainUrl, count, 0).pipe(
            map((data: ServerResponse<ExitVaults[]>) => {
                this.exitVaults = data.data;
            })
        )
    }
    private _getEnterVaultCount(): Observable<void> {
        return this._mainService.getCount(this._urls.warehouseEntryOrderMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getEnterVault(data.data.count)
            })
        )
    }
    private _getEnterVault(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.warehouseEntryOrderMainUrl, count, 0).pipe(
            map((data: ServerResponse<EnterVault[]>) => {
                this.enterVaults = data.data;
            })
        )
    }
    public save(): void {
        this._componentDataService.onClick();
        let materailAssets = [];

        if (this.materialValuesGroup.get('general') && this.materialValuesGroup.get('general').value && this.materialValuesGroup.get('general').value.productArray) {
            this.materialValuesGroup.get('general').value.productArray.forEach((value) => {
                let data = value.value
                let object = {
                    materialValueId: data.materialValuesId,
                    point: data.point,
                    count: data.quantity,
                    money: data.amount,
                    batch: data.groupCount,
                    invoiceRecord: data.invoiceRecord
                }
                if (data.id) {
                    object['id'] = data.id
                }
                materailAssets.push(object)
            })
        }

        let operationArray = []
        if (this.materialValuesGroup.get('operation') && this.materialValuesGroup.get('operation').value) {
            this.materialValuesGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }


        this._appService.markFormGroupTouched(this.materialValuesGroup);

        let sendObject = {
            date: this._datePipe.transform(this.materialValuesGroup.get('date').value, 'yyyy-MM-dd'),
            warehouseenterId: this._appService.checkProperty(this.materialValuesGroup.get('warehouseenter').value, 'id'),
            warehouseoutId: this._appService.checkProperty(this.materialValuesGroup.get('warehouseout').value, 'id'),
            documentNumber: this.materialValuesGroup.get('folderNumber').value,
            analiticGroup_2Id: this._appService.checkProperty(this._appService.checkProperty(this.materialValuesGroup.get('general').value, 'analyticalGroup2'),
                'id'),
            analiticGroup_1Id: this._appService.checkProperty(this._appService.checkProperty(this.materialValuesGroup.get('general').value, 'analyticalGroup1'),
                'id'),
            // printAtSalePrice: [null],            
            comment: this._appService.checkProperty(this.materialValuesGroup.get('general').value, 'comment'),
            product: materailAssets,
            operation: operationArray,
            //additionally
            chiefAccountant: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'chiefAccountant'),
            intermediary: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'intermediary'),
            allowed: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'allowed'),
            series: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'series'),
            number: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'number'),
            discharge_date: this._datePipe.transform(this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'discharge_date'), 'yyyy-MM-dd'),
            comment2: this._appService.checkProperty(this.materialValuesGroup.get('additionally').value, 'comment2')

        }

        if (this.materialValuesGroup.valid) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.materialValuesGroup)
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
        this.materialValuesGroup.get(controlName).setValue(event);
        this.onFocus(this.materialValuesGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.materialValuesGroup, controlName, property)
    }
    // public setModalParams(title: string, property: string) {
    //     let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
    //     return modalParams
    // }
    public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    get error(): string {
        return this._error
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe()
    }
}
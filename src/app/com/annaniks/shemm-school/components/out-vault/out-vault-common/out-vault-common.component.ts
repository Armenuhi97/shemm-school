import { Component, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { DeletedFormArrayModel, MaterialValues, AnalyticalGroup, Partner, AccountPlans, WareHouse, ServerResponse, WarehouseAcquistion } from '../../../models/global.models';
import { AppService, ComponentDataService, OftenUsedParamsService, LoadingService } from '../../../services';
import { Subscription } from 'rxjs';
import { ExitOrderService } from '../../../views/main/warehouse/pages/exit-order/exit-order.service';
import { MatDialog } from '@angular/material';
import { BatchModal } from '../../../modals/batch/batch.modal';
import { DatePipe } from '@angular/common';
import { MainService } from '../../../views/main/main.service';

@Component({
    selector: 'app-out-vault-common',
    templateUrl: 'out-vault-common.component.html',
    styleUrls: ['out-vault-common.component.scss']
})
export class OutVaultCommonComponent {
    private _isCalculateByFifo: boolean = true
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private _subscription: Subscription
    public unitOfMeasurements: MaterialValues[] = []
    public commonGroup: FormGroup;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    private _selectedWarehouse: WareHouse;
    public warehouses: WareHouse[] = [];
    private _selectedWareHouseAcquistion: WarehouseAcquistion;
    private _date: string;
    public wareHouseAcquistions: WarehouseAcquistion[] = []
    @Input('unitOfMeasurements')
    set setunitOfMeasurements($event: MaterialValues[]) {
        this.unitOfMeasurements = $event
    }
    @Input('chartAccounts')
    set setChartAccount($event: AccountPlans[]) {
        this.chartAccounts = $event
    }

    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event: AnalyticalGroup[]) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event: AnalyticalGroup[]) {
        this.analyticalGroup2 = $event
    }
    @Input('wareHouses')
    set setWareHouses($event: WareHouse[]) {
        this.warehouses = $event
    }
    @Input('wareHouseAcquistions')
    set setWareHouseAcquistions($event) {
        this.wareHouseAcquistions = $event
    }
    @Input('exitSpecification') exitSpecification = []
    @Input('date')
    set setDate($event) {
        this._date = $event ? this._datePipe.transform($event, 'yyyy-MM-dd') : null;
        if (this._date) {
            (this.commonGroup.get('productArray') as FormArray).controls.forEach(element => {
                element.patchValue({
                    code: null,
                    materialValuesArray: this._getMaterialValuesByWarehouseId(this._appService.checkProperty(element.get('wareHouse').value, 'id', 0),
                        this._appService.checkProperty(element.get('wareHouseAcquistion').value, 'id', 0))
                })
            });

        }
    }

    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.commonGroup.patchValue($event)
            this._appService.markFormGroupTouched(this.commonGroup)
            if ($event.productArray && $event.productArray.length) {
                (this.commonGroup.controls.productArray as FormArray) = this._fb.array([])
                $event.productArray.forEach(element => {

                    (this.commonGroup.get('productArray') as FormArray).push(element);

                    this._appService.markFormGroupTouched(element);
                });
                (this.commonGroup.get('productArray') as FormArray).controls.forEach((data: FormGroup) => {
                    let group = data.get('groupCount').value ? data.get('groupCount').value : null;
                    let group2 = data.get('allGroupArrays').value;
                    if (group && !group.controls) {
                        // (data.value.groupCount as FormArray) = this._fb.array([])
                        (data.get('groupCount') as FormArray).clear()
                        group.forEach((val) => {
                            (data.get('groupCount') as FormArray).push(this._fb.group(val))
                        });
                        (data.get('allGroupArrays') as FormArray).clear()

                        group2.forEach((val) => {
                            (data.get('allGroupArrays') as FormArray).push(this._fb.group(val))
                        })
                    } else {
                        if (group.controls) {
                            let formArray1 = data.get('groupCount') as FormArray
                            formArray1 = this._fb.array([]);
                            let formArray2 = data.get('allGroupArrays') as FormArray
                            formArray2 = this._fb.array([]);

                            formArray1 = group;
                            formArray2 = group2;
                            (data.get('groupCount') as FormArray).clear()
                            formArray1.controls.forEach((result) => {
                                (data.get('groupCount') as FormArray).push(result)
                            });
                            (data.get('allGroupArrays') as FormArray).clear()
                            formArray2.controls.forEach((result) => {
                                (data.get('allGroupArrays') as FormArray).push(result)
                            })
                        }
                    }
                });

                (this.commonGroup.get('productArray') as FormArray).controls.forEach((data: FormGroup) => {

                    if (!data.value.materialValuesArray) {
                        data.patchValue({
                            materialValuesArray: this._getMaterialValuesByWarehouseId(this._appService.checkProperty(data.value.wareHouse, 'id', 0), this._appService.checkProperty(data.value.wareHouseAcquistion, 'id', 0))
                        })
                        if (data.get('code').value) {

                            data.get('code').value['allDate'] = data.get('groupCount').value;
                            if (data.get('code').value.allDate && data.get('code').value.allDate.length) {
                                data.get('code').value['point'] = data.get('code').value.allDate[0].point
                                data.get('code').value.allDate.forEach((code) => {
                                    code['availability'] = code.count;
                                    code['calculateCount'] = new FormControl(code.quantity, [Validators.max(code.count), Validators.min(0)])
                                })

                            }
                        }

                    }
                })

                this.changeAmount();

            }
        }
    }

    @Input('selectedWareHouse')
    set setSelectedWareHouse($event: WareHouse) {
        this._selectedWarehouse = $event;
        if (this._selectedWarehouse) {
            if (this._selectedWarehouse.id !== this._oftenUsedParamsService.getPreviousValue()) {
                // let expenceAccount = (this._selectedWarehouse.warehouseSignificance && this._selectedWarehouse.warehouseSignificance.expenseAccountId) ? this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._selectedWarehouse.warehouseSignificance.expenseAccountId, 'id'), 0) : null;
                // if (this._selectedWarehouse.id !== this._oftenUsedParamsService.getPreviousValue())
                //     this.commonGroup.get('expenseAccount').setValue(expenceAccount);
                (this.commonGroup.get('productArray') as FormArray).controls.forEach(element => {

                    if (element.get('wareHouse').value !== this._selectedWarehouse)
                        element.patchValue({
                            wareHouse: this._selectedWarehouse,
                            code: null,
                            materialValuesArray: this._getMaterialValuesByWarehouseId(this._appService.checkProperty(this._selectedWarehouse, 'id', 0),
                                this._appService.checkProperty(element.get('wareHouseAcquistion').value, 'id', 0))
                        })
                });


            }
            this._oftenUsedParamsService.setPreviousValue(this._selectedWarehouse.id)
        }
    }
    @Input('selectedWareHouseAcquistion')
    set setSelectedWareHouseAcquistion($event) {
        this._selectedWareHouseAcquistion = $event;
        if ($event) {
            if (this._selectedWareHouseAcquistion.id !== this._oftenUsedParamsService.getPreviousValue2()) {
                (this.commonGroup.get('productArray') as FormArray).controls.forEach(element => {

                    if (element.get('wareHouseAcquistion').value !== this._selectedWareHouseAcquistion)
                        element.patchValue({
                            wareHouseAcquistion: this._selectedWareHouseAcquistion,
                            code: null,
                            materialValuesArray: this._getMaterialValuesByWarehouseId(
                                this._appService.checkProperty(element.get('wareHouse').value, 'id', 0),
                                this._appService.checkProperty(this._selectedWareHouseAcquistion, 'id', 0))
                        })
                });
            }
            this._oftenUsedParamsService.setPreviousValue2(this._selectedWareHouseAcquistion.id)
        }

    }

    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _loadingService: LoadingService,
        private _datePipe: DatePipe,
        private _matDialog: MatDialog,
        private _mainService:MainService,
        private _exitOrderService: ExitOrderService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let formArray = this.commonGroup.get('productArray') as FormArray;
                let isValid = (formArray && formArray.valid) ? true : false;
                this._componentDataService.sendData(this.commonGroup, 'general', isValid, this._deletedGroupsArray)
                this._deletedGroupsArray = []
            }
        })
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.commonGroup = this._fb.group({
            expenseAccount: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null],
            totalAmount: [0],
            productArray: this._fb.array([
                this._fb.group({
                    wareHouse: [null],
                    wareHouseAcquistion: [null],
                    code: [null],
                    quantity: [0],
                    amount: [0],
                    groupCount: this._fb.array([]),
                    availability: [0],
                    groupText: [null],
                    allGroupArrays: this._fb.array([]),
                    id: [null],
                    materialValuesArray: [[]]
                })
            ])
        })
    }

    public addRow(event: boolean): void {
        if (event) {
            let wareHouse = this._selectedWarehouse ? this._selectedWarehouse : null;
            let wareHouseAcquistion = this._selectedWareHouseAcquistion ? this._selectedWareHouseAcquistion : null;
            let materialListArray = this._getMaterialValuesByWarehouseId(this._appService.checkProperty(wareHouse, 'id', 0), this._appService.checkProperty(this._selectedWareHouseAcquistion, 'id', 0))
            // let expenceAccount = (this._selectedWarehouse.warehouseSignificance && this._selectedWarehouse.warehouseSignificance.expenseAccountId) ? this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._selectedWarehouse.warehouseSignificance.expenseAccountId, 'id'), 0) : null
            let formArray = this.commonGroup.get('productArray') as FormArray;
            formArray.push(this._fb.group({
                wareHouse: [wareHouse],
                wareHouseAcquistion: [wareHouseAcquistion],
                code: [null],
                quantity: [0],
                amount: [0],
                groupCount: this._fb.array([]),
                availability: [0],
                allGroupArrays: this._fb.array([]),
                groupText: [null],
                id: [null],
                materialValuesArray: [materialListArray]

            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.commonGroup.get('productArray') as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index);
        this.changeAmount()
    }
    public deleteAll(event: boolean): void {
        let formArray = this.commonGroup.get('productArray') as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(formArray.length - 1);
            this.changeAmount();
        }
    }
    public changeAmount(): void {
        let sum: number = 0
        if (this.commonGroup.get('productArray') && this.commonGroup.get('productArray')['controls']) {
            for (let item of this.commonGroup.get('productArray')['controls']) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0
                }
            }
        }
        this.commonGroup.get('totalAmount').setValue(sum)
    }
    public setValue(event, controlName: string, form: FormGroup = this.commonGroup): void {


        if (controlName == 'wareHouse') {
            if (form.get(controlName).value !== event) {
                this._loadingService.showLoading();

                this._setDataByMaterialValues(this._appService.checkProperty(event, 'id', 0), this._appService.checkProperty(form.get('wareHouseAcquistion').value, 'id', 0), form)
            }
        }
        if (controlName == 'wareHouseAcquistion') {
            if (form.get(controlName).value !== event) {
                this._loadingService.showLoading()
                this._setDataByMaterialValues(this._appService.checkProperty(form.get('wareHouse').value, 'id', 0), this._appService.checkProperty(event, 'id', 0), form)
            }
        }

        form.get(controlName).setValue(event);
        if (controlName == 'code') {
            if (event) {
                let warehouse = this._appService.checkProperty(this._appService.filterArray(this.warehouses, event.warehouseId, 'id'), 0)
                let wareHouseAcquistion = this._appService.checkProperty(this._appService.filterArray(this.wareHouseAcquistions, event.warehouseSignificanceId, 'id'), 0)
                this._setDataByMaterialValues(this._appService.checkProperty(warehouse, 'id', 0), this._appService.checkProperty(wareHouseAcquistion, 'id', 0), form, true)
                form.patchValue({
                    wareHouse: warehouse,
                    wareHouseAcquistion: wareHouseAcquistion
                })
            }
        }
        if (event)
            if (controlName == 'code' && this._isCalculateByFifo) {
                this._calculateBatchValueByFifo(form)
            }
        this.onFocus(form, controlName)

    }

    private _calculateBatchValueByFifo(form: FormGroup) {
        this._mainService.calculateBatchValueByFifo(form,this._fb)
      

    }
    public changeQuantity(form: FormGroup) {
        if (form.get('code').value) {
            if (this._isCalculateByFifo) {
                this._calculateBatchValueByFifo(form)
            }
        } else {
            if (this._isCalculateByFifo) {
                (form.get('groupCount').value as FormArray) = this._fb.array([]);
                (form.get('allGroupArrays').value as FormArray) = this._fb.array([])
            }
        }
    }


    private _getMaterialValuesByWarehouseId(id: number, typeId: number) {
        return this._mainService.getMaterialValuesByWarehouseId(id,typeId,this._date,this.exitSpecification)
    }
    public change2() {
        this._isCalculateByFifo = true

    }
    private _setDataByMaterialValues(id: number, typeId: number, item: FormGroup, isReset?: boolean) {
        return this._mainService.setDataByMaterialValues(id, typeId, item, this._date, this.exitSpecification, isReset)
        
    }

    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form = this.commonGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public selectGroup(item) {
        let selectedObject = {
            warehouse: item.get('wareHouse').value,
            materialValue: item.get('code').value,
            point: item.get('code').value && item.get('code').value.point ? item.get('code').value.point : null
        }
        if (item.get('allGroupArrays').value && item.get('allGroupArrays').value.length) {
            let dialog = this._matDialog.open(BatchModal, {
                width: '75vw',
                autoFocus: false,
                data: {
                    selectedObject: selectedObject, accounts: this.chartAccounts,
                    data: item.get('allGroupArrays').value
                }
            })
            dialog.afterClosed().subscribe((result) => {
                if (result) {
                    if (result.count) {
                        if (result.array) {
                            this._isCalculateByFifo = false;
                            (item.get('groupCount').value as FormArray) = this._fb.array([]);
                            (item.get('allGroupArrays').value as FormArray) = this._fb.array([]);
                            (item.get('groupCount').value as FormArray) = this._fb.array(result.array);
                            (item.get('allGroupArrays').value as FormArray) = this._fb.array(result.allBatches)
                            item.patchValue({
                                quantity: result.count,
                                groupText: 'Ընտրված է խմբաքանակ',
                                amount: result.amount
                            })

                        } else {
                            item.patchValue({
                                quantity: result.count,
                                amount: result.amount,
                                groupText: 'Ավտոընտրություն'
                            })

                            this._isCalculateByFifo = true
                            this._calculateBatchValueByFifo(item)

                        }
                    }
                }
            })
        }
    }
    public focus(item: FormGroup, controlName: string): void {
        this._appService.focus(item, controlName)
    }
    public blur(item: FormGroup, controlName: string): void {
        this._appService.blur(item, controlName)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
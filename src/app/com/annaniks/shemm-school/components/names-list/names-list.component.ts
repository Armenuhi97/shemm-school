
import { Component, Input } from "@angular/core";
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { ComponentDataService, AppService, OftenUsedParamsService, LoadingService } from '../../services';
import { DeletedFormArrayModel, WareHouse, AccountPlan, JsonObjectType, WarehouseAcquistion, ServerResponse, MaterialValues, AccountPlans, WarehouseConfig } from '../../models/global.models';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { WarehouseService } from '../../views/main/warehouse/warehouse.service';
import { MatDialog } from '@angular/material';
import { BatchModal } from '../../modals/batch/batch.modal';
import { MainService } from '../../views/main/main.service';

@Component({
    selector: 'app-names-list',
    templateUrl: 'names-list.component.html',
    styleUrls: ['names-list.component.scss']
})
export class NamesListComponent {
    private _isCalculateByFifo: boolean = true
    public calculationTypes: JsonObjectType[] = [];
    public chartAccounts: AccountPlans[] = []
    private _subscription: Subscription
    public unitOfMeasurements: MaterialValues[] = []
    public namesListGroup: FormGroup;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    private _selectedWarehouse: WareHouse;
    public warehouses: WareHouse[] = [];
    private _selectedWareHouseAcquistion: WarehouseAcquistion;
    private _date: string;
    private _warehouseConfig: WarehouseConfig;
    public wareHouseAcquistions: WarehouseAcquistion[] = []
    @Input('unitOfMeasurements')
    set setunitOfMeasurements($event: MaterialValues[]) {
        this.unitOfMeasurements = $event
    }
    @Input('calculationTypes')
    set setCalculationTypes($event: JsonObjectType[]) {
        this.calculationTypes = $event
        if ($event && $event.length)
            this.namesListGroup.get('calculationTypes').setValue(this.calculationTypes[2])
    }
    @Input('chartAccounts')
    set setChartAccounts($event: AccountPlans[]) {
        this.chartAccounts = $event
    }

    @Input('warehouses')
    set setWareHouses($event: WareHouse[]) {
        this.warehouses = $event
    }
    @Input('wareHouseAcquistions')
    set setWareHouseAcquistions($event) {
        this.wareHouseAcquistions = $event
    }
    @Input('warehouseConfig')
    set setConfig($event: WarehouseConfig) {
        this._warehouseConfig = $event
    }
    @Input('exitSpecification') exitSpecification = []
    @Input('date')
    set setDate($event) {
        this._date = $event ? this._datePipe.transform($event, 'yyyy-MM-dd') : null;
        if (this._date) {
            (this.namesListGroup.get('productArray') as FormArray).controls.forEach(element => {
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
            this.namesListGroup.patchValue($event)
            this._appService.markFormGroupTouched(this.namesListGroup)
            if ($event.productArray && $event.productArray.length) {
                (this.namesListGroup.controls.productArray as FormArray) = this._fb.array([])
                $event.productArray.forEach(element => {

                    (this.namesListGroup.get('productArray') as FormArray).push(element);

                    this._appService.markFormGroupTouched(element);
                });
                (this.namesListGroup.get('productArray') as FormArray).controls.forEach((data: FormGroup) => {
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

                (this.namesListGroup.get('productArray') as FormArray).controls.forEach((data: FormGroup) => {

                    if (!data.value.materialValuesArray) {
                        data.patchValue({
                            materialValuesArray: this._getMaterialValuesByWarehouseId(this._appService.checkProperty(data.value.wareHouse, 'id', 0), this._appService.checkProperty(data.value.wareHouseAcquistion, 'id', 0))
                        })
                        if (data.get('code').value) {
                            data.get('code').value['allDate'] = data.get('groupCount').value
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



            }
            this.change(false)
        }
    }

    @Input('selectedWareHouse')
    set setSelectedWareHouse($event: WareHouse) {
        this._selectedWarehouse = $event;
        if (this._selectedWarehouse) {
            if (this._selectedWarehouse.id !== this._oftenUsedParamsService.getPreviousValue()) {
                (this.namesListGroup.get('productArray') as FormArray).controls.forEach(element => {

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
                (this.namesListGroup.get('productArray') as FormArray).controls.forEach(element => {

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
        private _mainService: MainService,
        private _warehouseService: WarehouseService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let formArray = this.namesListGroup.get('productArray') as FormArray;
                let isValid = (formArray && formArray.valid) ? true : false;
                this._componentDataService.sendData(this.namesListGroup, 'namesList', isValid, this._deletedGroupsArray)
                this._deletedGroupsArray = []
            }
        })
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.namesListGroup = this._fb.group({
            calculationTypes: [this.calculationTypes[3], Validators.required],
            totalAmount: [0],
            totalCount: [0],
            totalAahAmount: [0],
            allAmount: [0],
            parentAAH: [0],
            productArray: this._fb.array([
                this._fb.group({
                    wareHouse: [null],
                    wareHouseAcquistion: [null],
                    code: [null],
                    quantity: [0],
                    amount: [0],
                    price: [0],
                    isAah: [false],
                    aahPrice: [0],
                    expenseAccount: [null],
                    incomeAccount: [null],
                    groupCount: this._fb.array([]),
                    availability: [0],
                    groupText: [null],
                    allGroupArrays: this._fb.array([]),
                    materialValuesArray: [[]],
                    groupAmount: [0]
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
            let formArray = this.namesListGroup.get('productArray') as FormArray;
            formArray.push(this._fb.group({
                wareHouse: [wareHouse],
                wareHouseAcquistion: [wareHouseAcquistion],
                code: [null],
                quantity: [0],
                amount: [0],
                price: [0],
                groupCount: this._fb.array([]),
                availability: [0],
                isAah: [false],
                aahPrice: [0],
                expenseAccount: [null],
                incomeAccount: [null],
                allGroupArrays: this._fb.array([]),
                groupText: [null],
                materialValuesArray: [materialListArray],
                groupAmount: [0]

            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.namesListGroup.get('productArray') as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index);
        this.change(false)
    }
    public deleteAll(event: boolean): void {
        let formArray = this.namesListGroup.get('productArray') as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(formArray.length - 1);
            this.change(false)
        }
    }

    public changeAmount(): void {
        let sum: number = 0;
        let isAahSum: number = 0
        let formArray = this.namesListGroup.get('productArray') as FormArray

        let percent;
        if (this._warehouseConfig && this.namesListGroup.get('calculationTypes').value && this.namesListGroup.get('calculationTypes').value.id) {
            if (this.namesListGroup.get('calculationTypes').value.id == 1) {
                let aahValue = this.namesListGroup.get('calculationTypes').value.id
                this.namesListGroup.get('parentAAH').setValue(aahValue)
                percent = this._warehouseConfig.aahPercent;

            } else {
                if (this.namesListGroup.get('calculationTypes').value.id == 2) {
                    let aahValue = this.namesListGroup.get('calculationTypes').value.id
                    this.namesListGroup.get('parentAAH').setValue(aahValue)
                    percent = this._warehouseConfig.aahNeraryalPercent

                } else {
                    this.namesListGroup.get('parentAAH').setValue(0)
                    percent = 0
                }
            }
        }
        if (formArray && formArray.controls) {
            for (let item of formArray.controls) {
                let aahPrice = 0
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0;
                    if (item.get('isAah').value) {
                        aahPrice = item.get('amount').value * percent / 100
                        isAahSum += (item.get('amount').value) ? +item.get('amount').value : 0;
                    }
                }
                item.get('aahPrice').setValue(aahPrice)
            }
        }
        let totalSumAahSum = isAahSum && percent !== null ? isAahSum * percent / 100 : 0
        this.namesListGroup.get('totalAahAmount').setValue(totalSumAahSum)
        this.namesListGroup.get('totalAmount').setValue(sum);
        let allAmount = this.namesListGroup.get('parentAAH').value == 1 ? totalSumAahSum + sum : sum
        this.namesListGroup.get('allAmount').setValue(allAmount)
    }

    private _calculateAmount(form: FormGroup) {
        let amount: number = 0;
        amount = form.get('quantity').value * form.get('price').value
        form.get('amount').setValue(amount);
    }
    public change(isCalculate: boolean, form?: FormGroup): void {
        if (isCalculate)
            this._calculateAmount(form)
        let sum: number = 0;
        let formArray = this.namesListGroup.get('productArray') as FormArray
        if (formArray && formArray) {
            for (let item of formArray.controls) {
                // if (item.get('quantity').value) {
                sum += (item.get('quantity').value) ? +item.get('quantity').value : 0
                // }
            }
        }
        this.namesListGroup.get('totalCount').setValue(sum)
        this.changeAmount()
    }
    private _isSetIsAahControl(id: number) {
        switch (id) {
            case 1: {
                this._setinFormIsAah(true, 1)
                break
            }
            case 2: {
                this._setinFormIsAah(true, 2)
                break
            }
            case 3: {
                this._setinFormIsAah(false, 0)
                break
            }
            case 4: {
                this._setinFormIsAah(false, 0)
                break
            }
        }
    }
    private _setinFormIsAah(isAdd: boolean, count: number) {
        if (isAdd) {
            (this.namesListGroup.get('productArray') as FormArray).controls.forEach((item: FormGroup) => {
                item.get('isAah').setValue(true)
            })

        } else {
            (this.namesListGroup.get('productArray') as FormArray).controls.forEach((item: FormGroup) => {
                item.get('isAah').setValue(false)
            })

        }

        this.namesListGroup.get('parentAAH').setValue(count);
        this.changeAmount()

    }
    public setValue(event, controlName: string, form: FormGroup = this.namesListGroup): void {

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

        if (event && controlName == 'calculationTypes') {
            this._isSetIsAahControl(event.id);
        }
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
        this._mainService.calculateBatchValueByFifo(form, this._fb)
    }
    public changeQuantity(form: FormGroup) {
        // form.get('quantity').value &&
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
        this.change(true, form)
    }

    private _getMaterialValuesByWarehouseId(id: number, typeId: number) {
        return this._mainService.getMaterialValuesByWarehouseId(id, typeId, this._date, this.exitSpecification)
    }
    public change2() {
        this._isCalculateByFifo = true

    }

    private _setDataByMaterialValues(id: number, typeId: number, item: FormGroup, isReset?: boolean) {
        return this._mainService.setDataByMaterialValues(id, typeId, item, this._date, this.exitSpecification, isReset)
    }

    public setModalParams(title: string, tabsArray: Array<string>, keys: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form = this.namesListGroup) {
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
                    isInvoice: true,
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
                                groupAmount: result.amount
                            })

                        } else {
                            item.patchValue({
                                quantity: result.count,
                                groupAmount: result.amount,
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
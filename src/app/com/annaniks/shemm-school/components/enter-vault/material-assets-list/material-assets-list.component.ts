import { Component, Input } from "@angular/core";
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService } from '../../../services';
import { Subscription } from 'rxjs';
import { DeletedFormArrayModel, MaterialValues, JsonObjectType, WareHouse, AccountPlans, Classifier, WarehouseAcquistion, WarehouseConfig } from '../../../models/global.models';

@Component({
    selector: 'app-material-assets-list',
    templateUrl: 'material-assets-list.component.html',
    styleUrls: ['material-assets-list.component.scss']
})
export class MaterialAssetsListComponent {
    private _subscription: Subscription;
    public materialListGroup: FormGroup;
    private _selectedWarehouse: WareHouse;
    public warehouses: WareHouse[] = []
    public unitOfMeasurements: MaterialValues[] = []
    public typeOfAcquisition: JsonObjectType[] = [];
    public calculationTypes: JsonObjectType[] = []
    public accounts: AccountPlans[] = [];
    public classifiers: Classifier[] = [];
    private _selectedWareHouseAcquistion: WarehouseAcquistion;
    public wareHouseAcquistions: WarehouseAcquistion[] = [];
    private _warehouseConfig: WarehouseConfig
    @Input('classifiers')
    set setClassifiers($event: Classifier[]) {
        this.classifiers = $event
    }
    @Input('typeOfAcquisition')
    set setAcquisition($event: JsonObjectType[]) {
        this.typeOfAcquisition = $event
    }
    @Input('calculationTypes')
    set setcalculationTypes($event: JsonObjectType[]) {
        this.calculationTypes = $event;
        if ($event && $event.length)
            this.materialListGroup.get('calculationType').setValue(this.calculationTypes[2])
    }
    @Input('chartAccounts')
    set setAccounts($event: AccountPlans[]) {
        this.accounts = $event
    }
    @Input('wareHouses')
    set setWareHouses($event: WareHouse[]) {
        this.warehouses = $event
    }
    @Input('wareHouseAcquistions')
    set setWareHouseAcquistions($event) {
        this.wareHouseAcquistions = $event
    }
    @Input('selectedWareHouse')
    set setSelectedWareHouse($event: WareHouse) {
        this._selectedWarehouse = $event;
        if ($event) {
            (this.materialListGroup.get('materialAssetsArray') as FormArray).controls.forEach(element => {
                element.patchValue({
                    wareHouse: this._selectedWarehouse,
                    // expenceAccount: (this._selectedWarehouse.warehouseSignificance && this._selectedWarehouse.warehouseSignificance.expenseAccountId) ? this._appService.checkProperty(this._appService.filterArray(this.accounts, this._selectedWarehouse.warehouseSignificance.expenseAccountId, 'id'), 0) : null

                })
            });
        }
    }

    @Input('selectedWareHouseAcquistion')
    set setSelectedWareHouseAcquistion($event) {
        this._selectedWareHouseAcquistion = $event;
        if ($event) {
            (this.materialListGroup.get('materialAssetsArray') as FormArray).controls.forEach(element => {
                element.patchValue({
                    wareHouseAcquistion: this._selectedWareHouseAcquistion,
                    expenceAccount: this._appService.checkProperty(this._selectedWareHouseAcquistion, 'expenseAccount')
                })
            });
        }
    }
    @Input('warehouseConfig')
    set setConfig($event: WarehouseConfig) {
        this._warehouseConfig = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.materialListGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.materialListGroup);
            if ($event.materialAssetsArray && $event.materialAssetsArray.length) {
                (this.materialListGroup.controls.materialAssetsArray as FormArray) = this._fb.array([])
                $event.materialAssetsArray.forEach(element => {
                    (this.materialListGroup.get('materialAssetsArray') as FormArray).push(element)
                    this._appService.markFormGroupTouched(element);
                });
                this.changeAmount();
                this.change(false)
            }
        }
    }

    @Input('unitOfMeasurements')
    set setunitOfMeasurements($event: MaterialValues[]) {
        this.unitOfMeasurements = $event
    }
    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService, ) {
        this._validate()

    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.materialListGroup) {
                    let isValid = this.materialListGroup.valid ? true : false;
                    this._componentDataService.sendData(this.materialListGroup, 'materialAssetsList', isValid);
                }
            }
        })
    }
    private _calculateAmount(form: FormGroup) {
        let amount: number = 0;
        amount = form.get('count').value * form.get('price').value
        form.get('amount').setValue(amount);
    }

    public change(isCalculate: boolean, form?: FormGroup): void {
        if (isCalculate)
            this._calculateAmount(form)
        let sum: number = 0;
        let formArray = this.materialListGroup.get('materialAssetsArray') as FormArray
        if (formArray && formArray) {
            for (let item of formArray.controls) {
                if (item.get('count').value) {
                    sum += (item.get('count').value) ? +item.get('count').value : 0
                }
            }
        }
        this.materialListGroup.get('totalCount').setValue(sum)
        this.changeAmount()
    }
    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }
    public setModalParams(title: string, keys: Array<string>, tabs: Array<string>) {
        let modalParams = { tabs: tabs, title: title, keys: keys };
        return modalParams
    }
    private _validate(): void {
        this.materialListGroup = this._fb.group({
            // acquisitionType: [null, Validators.required],
            calculationType: [null, Validators.required],
            totalCount: [0],
            totalAmount: [0],
            totalAahAmount: [0],
            isIncludeAahInCost: [false],
            parentAAH: [0],
            materialAssetsArray: this._fb.array([
                this._fb.group({
                    wareHouse: [null],
                    wareHouseAcquistion: [null],
                    expenceAccount: [null],
                    code: [null],
                    point: [null],
                    count: [0],
                    isAah: [false],
                    price: [0],
                    amount: [0],
                    account: [null],
                    atgaa: [null],
                })
            ])
        })
    }
    public addRow(event: boolean): void {
        if (event) {
            let wareHouse = this._selectedWarehouse ? this._selectedWarehouse : null
            let expenceAccount = (this._selectedWareHouseAcquistion && this._selectedWareHouseAcquistion.expenseAccount) ? this._selectedWareHouseAcquistion.expenseAccount : null;
            let wareHouseAcquistion = this._selectedWareHouseAcquistion ? this._selectedWareHouseAcquistion : null
            let formArray = this.materialListGroup.get('materialAssetsArray') as FormArray
            let object = {
                wareHouse: [wareHouse, Validators.required],
                wareHouseAcquistion: [wareHouseAcquistion],
                expenceAccount: [expenceAccount],
                code: [null],
                point: [null],
                count: [0],
                price: [0],
                amount: [0],
                isAah: [false],
                account: [null],
                atgaa: [null],
            }
            if (this.materialListGroup.get('parentAAH').value) {
                object['isAah'] = [true]
            }
            formArray.push(this._fb.group(object))
        }
    }

    public remove(index: number): void {
        let formArray = this.materialListGroup.get('materialAssetsArray') as FormArray;
        // this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
        //     this._deletedGroupsArray.push(data)
        // })
        formArray.removeAt(index);
        this.changeAmount();
        this.change(false)
    }
    public deleteAll(event: boolean): void {
        let formArray = this.materialListGroup.get('materialAssetsArray') as FormArray

        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            // this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            //     this._deletedGroupsArray.push(data)
            // })
            formArray.removeAt(index);
            this.changeAmount();
            this.change(false)
        }
    }

    public changeAmount(): void {
        let sum: number = 0;
        let isAahSum: number = 0
        let formArray = this.materialListGroup.get('materialAssetsArray') as FormArray
        if (formArray && formArray.controls) {
            for (let item of formArray.controls) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0;
                    if (item.get('isAah').value) {
                        isAahSum += (item.get('amount').value) ? +item.get('amount').value : 0;
                    }
                }
            }
        }
        let percent;
        if (this._warehouseConfig && this.materialListGroup.get('calculationType').value && this.materialListGroup.get('calculationType').value.id) {
            if (this.materialListGroup.get('calculationType').value.id == 1) {
                let aahValue = this.materialListGroup.get('isIncludeAahInCost').value ? 2 : 1
                this.materialListGroup.get('parentAAH').setValue(aahValue)
                percent = this.materialListGroup.get('isIncludeAahInCost').value ? this._warehouseConfig.aahNeraryalPercent : this._warehouseConfig.aahPercent
               
                
            } else {
                if (this.materialListGroup.get('calculationType').value.id == 2) {
                    let aahValue = this.materialListGroup.get('isIncludeAahInCost').value ? 0 : 2
                    this.materialListGroup.get('parentAAH').setValue(aahValue)
                    percent = this.materialListGroup.get('isIncludeAahInCost').value ? 0 : this._warehouseConfig.aahNeraryalPercent

                }else{
                    this.materialListGroup.get('parentAAH').setValue(0);
                    percent=0
                }
            }
        }

        let totalSumAahSum = isAahSum && percent  ? isAahSum * percent / 100 : 0
        this.materialListGroup.get('totalAahAmount').setValue(totalSumAahSum)
        this.materialListGroup.get('totalAmount').setValue(sum)
    }

    public setValue(event, controlName: string, form: FormGroup = this.materialListGroup): void {
        form.get(controlName).setValue(event);
        if (event && controlName == 'wareHouseAcquistion') {
            if (event.expenseAccount)
                form.get('expenceAccount').setValue(event.expenseAccount)
        }
        if (event && controlName == 'calculationType') {
            this._isSetIsAahControl(event.id);
        }
        this.onFocus(form, controlName)

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
            (this.materialListGroup.get('materialAssetsArray') as FormArray).controls.forEach((item: FormGroup) => {
                item.get('isAah').setValue(true)
            })

        } else {
            (this.materialListGroup.get('materialAssetsArray') as FormArray).controls.forEach((item: FormGroup) => {
                item.get('isAah').setValue(false)
            })

        }

        this.materialListGroup.get('parentAAH').setValue(count);
        this.changeAmount()

    }
    public focus(item: FormGroup, controlName: string): void {
        this._appService.focus(item, controlName)
    }

    public blur(item: FormGroup, controlName: string): void {
        this._appService.blur(item, controlName)
    }
    public setTableValue(event, form: FormGroup): void {
        form.patchValue({
            code: event,

            account: (event && event.account) ? event.account : null,
            atgaa: (event && event.classification) ? event.classification : null,
            point: (event && event.measurementUnit && event.measurementUnit.unit) ? event.measurementUnit.unit : null
        })
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.materialListGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
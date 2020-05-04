import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MainService } from '../../views/main/main.service';
import { LoadingService, AppService } from '../../services';
import { MessageService } from 'primeng/api/';
import { AccountPlans, WareHouse } from '../../models/global.models';

@Component({
    selector: 'batch-modal',
    templateUrl: 'batch.modal.html',
    styleUrls: ['batch.modal.scss']
})
export class BatchModal {
    public title: string = 'Ելքի սպեցիֆիկացիա'
    public items = [];
    public totalCount: number = 0;
    public totalAvailability: number = 0;
    public totalSum: number = 0
    public batchGroup: FormGroup;
    public warehouses: WareHouse[] = [];
    public materialValues = []
    public accountPlans: AccountPlans[] = [];
    constructor(@Inject(MAT_DIALOG_DATA) private _data,
        private _dialogRef: MatDialogRef<BatchModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        private _messageService: MessageService,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject('URL_NAMES') private _urls) {
        this._validate()
        this._setEntity()

    }
    ngOnInit() {
        this._setFormValue()
    }
    private _setEntity() {
        this.items = (this._data.data && this._data.data.value) ? this._data.data.value : this._data.data;
        this.totalCount = 0;
        this.totalAvailability = 0;
        this.totalSum=0;
        this.items.forEach((data) => {
            if (!data.calculateCount.value && data.calculateCount.value !== 0) {
                data['calculateCount'] = new FormControl(data.calculateCount, [Validators.max(data.count), Validators.min(0)])
            }
            if (!data.costPrice && data.costPrice !== 0) {
                this._calculateCostPrice(data)
                // data.costPrice =data.calculateCount.value * item
            }
            this.totalSum += data.costPrice
            this.totalAvailability += data.availability;
            this.totalCount += data.calculateCount.value
        })
    }
    public changeCount() {
        this.totalSum = 0;
        this.totalCount = 0
        this.items.forEach((data) => {
            this.totalCount += data.calculateCount.value;
            this._calculateCostPrice(data);
            this.totalSum += data.costPrice
        })
    }
    private _calculateCostPrice(item) {
        item['costPrice'] = item.calculateCount.value * item.price
    }
    private _setFormValue() {
        let selectedObject = this._data.selectedObject;

        this.batchGroup.patchValue({
            warehouse: selectedObject.warehouse,
            code: selectedObject.materialValue,
            unitOfMeasurement: selectedObject.point,
        })
    }
    public focus(item, controlName: string): void {
        if (item[controlName].value == 0)
            item[controlName].setValue(null)
    }

    public blur(item, controlName: string): void {
        if (item[controlName].value == null || item[controlName].value == 0)
            item[controlName].setValue(0)
    }

    private _validate() {
        this.batchGroup = this._fb.group({
            warehouse: [null],
            code: [null],
            unitOfMeasurement: [null]
        })
    }
    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    public setValue(event, controlName: string, form: FormGroup = this.batchGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.batchGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public close() {
        this._dialogRef.close(false)
    }
    public save(isAutomat: boolean) {
        let count = 0;
        let amount = 0
        let array = [];
        let allBatches = []
        for (let data of this.items) {
            if (data.calculateCount.valid) {
                allBatches.push(data)
                if (data.calculateCount.value) {
                    array.push(data)
                }
                count += data.calculateCount.value;
                amount += data.calculateCount.value * data.price
            } else {
                return
            }
        }
        if (isAutomat) {
            this._dialogRef.close({ count: count, amount: amount })
        } else {
            this._dialogRef.close({ count: count, array: array, allBatches: allBatches, amount: amount })
        }


    }
    public saveAutomat() {
        this._dialogRef.close(true)
    }
}
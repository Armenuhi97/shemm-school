import { Component, Input } from "@angular/core";
import { FormArray, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AnalyticalGroup, Partner, AccountPlans, DeletedFormArrayModel, MaterialValues } from '../../../models/global.models';
import { Subscription } from 'rxjs';
import { ComponentDataService, AppService } from '../../../services';

@Component({
    selector: 'app-material-value-shift-common',
    templateUrl: 'material-value-shift-common.component.html',
    styleUrls: ['material-value-shift-common.component.scss']
})
export class MaterialValueShiftCommonComponent {
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    public partners: Partner[] = [];
    // public chartAccounts: AccountPlans[] = []
    private _subscription: Subscription
    public unitOfMeasurements: MaterialValues[] = []
    public commonGroup: FormGroup;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    @Input('unitOfMeasurements')
    set setunitOfMeasurements($event: MaterialValues[]) {
        this.unitOfMeasurements = $event
    }
    // @Input('chartAccounts')
    // set setChartAccount($event: AccountPlans[]) {
    //     this.chartAccounts = $event
    // }

    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event: AnalyticalGroup[]) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event: AnalyticalGroup[]) {
        this.analyticalGroup2 = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.commonGroup.patchValue($event)
            this._appService.markFormGroupTouched(this.commonGroup)
            if ($event.productArray && $event.productArray.length) {
                (this.commonGroup.controls.productArray as FormArray) = this._fb.array([])
                $event.productArray.forEach(element => {
                    (this.commonGroup.get('productArray') as FormArray).push(element)

                    this._appService.markFormGroupTouched(element);
                });
                this.changeAmount();
                this.changeCount()
            }

        }
    }
    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService) {
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

    public onFocus( form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.commonGroup = this._fb.group({
            printAtSalePrice: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null],
            totalAmount: [0],
            totalCount: [0],
            productArray: this._fb.array([
                this._fb.group({
                    code: [null, Validators.required],
                    name: [null, Validators.required],
                    point:[null, Validators.required],
                    quantity: [0, Validators.required],
                    amount: [0, Validators.required],
                    invoiceRecord: [null, Validators.required],
                    groupCount: [0, Validators.required],
                    id: [null],
                    materialValuesId: [null],
                })
            ])
        })
    }

    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.commonGroup.get('productArray') as FormArray;
            formArray.push(this._fb.group({
                code: [null, Validators.required],
                name: [null, Validators.required],
                point:[null, Validators.required],
                quantity: [0, Validators.required],
                amount: [0, Validators.required],
                invoiceRecord: [null, Validators.required],
                groupCount: [0, Validators.required],
                id: [null],
                materialValuesId: [null],
            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.commonGroup.get('productArray') as FormArray;
        this._deletedGroupsArray = this._appService.setDeletedFormArray(formArray, index)
        formArray.removeAt(index);
        this.changeAmount();
        this.changeCount()
    }
    public deleteAll(event: boolean): void {
        let formArray = this.commonGroup.get('productArray') as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._deletedGroupsArray = this._appService.setDeletedFormArray(formArray, index)
            formArray.removeAt(formArray.length - 1);
            this.changeAmount();
            this.changeCount()
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
    public changeCount(): void {
        let sum: number = 0
        if (this.commonGroup.get('productArray') && this.commonGroup.get('productArray')['controls']) {
            for (let item of this.commonGroup.get('productArray')['controls']) {
                if (item.get('quantity').value) {
                    sum += (item.get('quantity').value) ? +item.get('quantity').value : 0
                }
            }
        }
        this.commonGroup.get('totalCount').setValue(sum)
    }
    public setValue(event, controlName: string, form: FormGroup = this.commonGroup) {
            form.get(controlName).setValue(event)
            this.onFocus(form,controlName)

    }
    public setTableValue(event, form: FormGroup): void {
        // if (event) {
            form.patchValue({
                code: (event && event.barCode)?event.barCode:null,
                name: (event && event.name)?event.name:null,
                materialValuesId: (event && event.id)?event.id:null,
                point: (event && event.measurementUnit && event.measurementUnit.unit) ? event.measurementUnit.unit : null

            })
            this.onFocus(form,'code')

        // }
    }
    public setModalParams(title: string, codeKeyName: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form = this.commonGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
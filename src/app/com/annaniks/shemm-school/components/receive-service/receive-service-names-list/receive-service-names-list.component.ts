import { Component, Input } from "@angular/core";
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService } from '../../../services';
import { Subscription } from 'rxjs';
import { DeletedFormArrayModel, AccountPlan, MaterialValues, Services, JsonObjectType } from '../../../models/global.models';

@Component({
    selector: 'app-receive-service-names-list',
    templateUrl: 'receive-service-names-list.component.html',
    styleUrls: ['receive-service-names-list.component.scss']
})
export class ReceiveServiceNamesComponent {
    public totalAmount: number = 0;
    public totalCount: number = 0;
    public filterGroup: FormGroup;
    public chartAccounts: AccountPlan[] = []
    public namesListArray: FormArray;
    public services: Services[] = []
    public typeOfAcquisition: JsonObjectType[] = [];
    public calculationTypes: JsonObjectType[] = []
    public receiveServiceNamesListGroup: FormGroup;
    private _subscription: Subscription;
    public aahFormOfReflection = []
    private _deletedGroupsArray: DeletedFormArrayModel[] = []
    @Input('typeOfAcquisition')
    set setAcquisition($event: JsonObjectType[]) {
        this.typeOfAcquisition = $event
    }
    @Input('aahFormOfReflection')
    set setAahFormOfReflection($event: JsonObjectType[]) {
        this.aahFormOfReflection = $event
    }
    @Input('calculationTypes')
    set setCalculationTypes($event: JsonObjectType[]) {
        this.calculationTypes = $event
    }
    @Input('chartAccounts')
    set setChartAccounts($event: AccountPlan[]) {
        this.chartAccounts = $event
    }
    @Input('services')
    set setAccount($event: Services[]) {
        this.services = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.receiveServiceNamesListGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.receiveServiceNamesListGroup);
            if ($event.products && $event.products.length) {
                (this.receiveServiceNamesListGroup.controls.products as FormArray) = this._fb.array([])
                $event.products.forEach(element => {
                    // this.change(element.controls);
                    (this.receiveServiceNamesListGroup.get('products') as FormArray).push(element)
                    this._appService.markFormGroupTouched(element);
                });

            }
        }
    }

    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService, ) {
        this._validate()

    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.receiveServiceNamesListGroup) {
                    let formArray = this.receiveServiceNamesListGroup.get('products') as FormArray;
                    let isValid = (formArray && formArray.valid && this.receiveServiceNamesListGroup.get('calculationType').valid &&
                        this.receiveServiceNamesListGroup.get('serviceType').valid
                    ) ? true : false;
                    this._componentDataService.sendData(this.receiveServiceNamesListGroup, 'namesList', isValid, this._deletedGroupsArray);
                    this._deletedGroupsArray = []
                }
            }
        })
    }

    public change(form: FormGroup): void {
        let amount: number = 0;
        amount = form.get('count').value * form.get('price').value
        form.get('amount').setValue(amount);
        this.changeAmount()
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setModalParams(title: string, codeKeyName: string, titleCodeKey: string = 'Կոդ') {
        let modalParams = { tabs: [titleCodeKey, 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }
    private _validate(): void {
        this.receiveServiceNamesListGroup = this._fb.group({
            serviceType: [null, Validators.required],
            calculationType: [null, Validators.required],
            totalAmount: [0],
            isIncludeAahInCost: [false],
            reflectionForm: [null],
            products: this._fb.array([
                this._fb.group({
                    code: [null, Validators.required],
                    name: [null, Validators.required],
                    point: [null, Validators.required],
                    count: [0, Validators.required],
                    price: [0, Validators.required],
                    amount: [0, Validators.required],
                    isAah: [false],
                    account: [null, Validators.required],
                    servicesId: [null],
                    id: [null],
                    // accountId: [null],
                })
            ])
        })
    }
    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.receiveServiceNamesListGroup.get('products') as FormArray
            formArray.push(this._fb.group({
                code: [null, Validators.required],
                name: [null, Validators.required],
                point: [null, Validators.required],
                count: [0, Validators.required],
                price: [0, Validators.required],
                amount: [0, Validators.required],
                isAah: [false, Validators.required],
                account: [null, Validators.required],
                id: [null],
                servicesId: [null],
                // accountId: [null],
            }))
        }
    }

    public remove(index: number): void {
        let formArray = this.receiveServiceNamesListGroup.get('products') as FormArray;
        this._deletedGroupsArray = this._appService.setDeletedFormArray(formArray, index)
        formArray.removeAt(index);
        this.changeAmount();

    }
    public deleteAll(event: boolean): void {
        let formArray = this.receiveServiceNamesListGroup.get('products') as FormArray

        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._deletedGroupsArray = this._appService.setDeletedFormArray(formArray, index)
            formArray.removeAt(formArray.length - 1);
            this.changeAmount();

        }
    }

    public changeAmount(): void {
        let sum: number = 0;
        let formArray = this.receiveServiceNamesListGroup.get('products') as FormArray
        if (formArray && formArray.controls) {
            for (let item of formArray.controls) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0
                }
            }
        }
        this.receiveServiceNamesListGroup.get('totalAmount').setValue(sum)
    }


    public setValue(event, controlName: string, form: FormGroup = this.receiveServiceNamesListGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form,controlName)

    }
    public setTableValue(event, form: FormGroup): void {
        form.patchValue({
            code: (event && event.code) ? event.code : null,
            name: (event && event.name) ? event.name : null,
            servicesId: (event && event.id) ? event.id : null,
            point: (event && event.measurementUnit && event.measurementUnit.unit) ? event.measurementUnit.unit : null
        })
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.receiveServiceNamesListGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
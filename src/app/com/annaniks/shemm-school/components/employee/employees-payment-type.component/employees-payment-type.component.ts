import { Component, Input } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentDataService, AppService } from '../../../services';
import { Subscription } from 'rxjs';
import { DeletedFormArrayModel, AccountPlans } from '../../../models/global.models';

@Component({
    selector: 'app-employees-payment-type',
    templateUrl: 'employees-payment-type.component.html',
    styleUrls: ['employees-payment-type.component.scss']
})
export class EmployeesPaymentType {
    public otherWithheldPaymentsTypes = []
    public accountPlans: AccountPlans[] = []
    public paymentGroupArray: FormArray = this._fb.array([]);
    private _subscription: Subscription;
    public types: Array<{ name: string }> = []
    @Input('otherWithheldPaymentsTypes')
    set setOtherWithheldPaymentsTypes($event: Array<{ name: string }>) {
        this.otherWithheldPaymentsTypes = $event
    }
    @Input('types')
    set setTypes($event: Array<{ name: string }>) {
        this.types = $event
    }
    @Input('accountPlans')
    set setAccountPlans($event: AccountPlans[]) {
        if ($event) {
            this.accountPlans = $event
        }
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.paymentGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.paymentGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });
        }
    }

    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.paymentGroupArray) {
                    let isValid = this.paymentGroupArray && this.paymentGroupArray.valid ? true : false;

                    this._componentDataService.sendData(this.paymentGroupArray.controls, 'payments', isValid)
                }
            }
        })
    }
    public setModalParams(title: string, key: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [key, 'name'] }
        return modalParams
    }

    private _validate(): void {
        this.paymentGroupArray = this._fb.array([
        //     this._fb.group(
        //     {
        //     otherWithheldPayments: [null, Validators.required],
        //     type: [null, Validators.required],
        //     planningCurrentAccounts: [null, Validators.required],
        //     savingType: [null, Validators.required],
        //     id: [null]
        // })
    ])

    }
    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.paymentGroupArray as FormArray;
            formArray.push(this._fb.group({
                name:[null,Validators.required],
                otherWithheldPayments: [null, Validators.required],
                type: [null, Validators.required],
                planningCurrentAccounts: [null, Validators.required],
                savingType: [null, Validators.required],
                id: [null]
            }))
        }
    }

    public remove(index: number): void {
        let formArray = this.paymentGroupArray as FormArray;
        formArray.removeAt(index)
    }
    public deleteAll(event: boolean): void {
        if (event && (this.paymentGroupArray && this.paymentGroupArray.length)) {
            let index = this.paymentGroupArray.length - 1;
            this.paymentGroupArray.removeAt(index)
        }
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }

    public setValue(event, controlName: string, form: FormGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }
    public setInputValue(item, controlName: string, property: string) {
        return this._appService.setInputValue(item, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
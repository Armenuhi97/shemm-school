import { Component, Input } from "@angular/core";
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';
import { AccountPlan } from '../../models/global.models';

@Component({
    selector: 'app-advertising-services',
    templateUrl: 'advertising-services.component.html',
    styleUrls: ['advertising-services.component.scss']
})
export class AdvertisingServicesComponent {
    public advertisingServicesGroupArray: FormArray;
    private _subscription: Subscription;
    public chartAccounts: AccountPlan[]=[]
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.advertisingServicesGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.advertisingServicesGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });

        }
    }
    @Input('chartAccounts')
    set setChartAccount($event: AccountPlan[]) {
        this.chartAccounts = $event
    }
    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.advertisingServicesGroupArray.valid ? true : false
                this._componentDataService.sendData(this.advertisingServicesGroupArray.controls, 'advertisingServices', isValid)
            }
        })
    }
    private _validate() {
        this.advertisingServicesGroupArray = this._fb.array([
            this._fb.group({
                inventory: [null, Validators.required],
                name: [null, Validators.required],
                initialInvoiceValue: [null, Validators.required],
                depreciationAccount: [null, Validators.required],
                expenseExpense: [null, Validators.required],
                deferredIncome: [null, Validators.required],
                deferredIncome2: [null, Validators.required],
                incomeAccount: [null, Validators.required],
                isWearFinance: [false, Validators.required],
                isWearFax: [false, Validators.required],
                isWearRevenue: [false, Validators.required]
            })
        ])
    }
    public addRow(event: boolean) {
        if (event) {
            let formArray = this.advertisingServicesGroupArray as FormArray;
            formArray.push(this._fb.group({
                inventory: [null, Validators.required],
                name: [null, Validators.required],
                initialInvoiceValue: [null, Validators.required],
                depreciationAccount: [null, Validators.required],
                expenseExpense: [null, Validators.required],
                deferredIncome: [null, Validators.required],
                deferredIncome2: [null, Validators.required],
                incomeAccount: [null, Validators.required],
                isWearFinance: [false, Validators.required],
                isWearFax: [false, Validators.required],
                isWearRevenue: [false, Validators.required]
            }))
        }
    }
    public remove(index: number) {
        let formArray = this.advertisingServicesGroupArray as FormArray;
        formArray.removeAt(index)
    }
    public deleteAll(event: boolean): void {
        let formArray = this.advertisingServicesGroupArray as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            formArray.removeAt(index)
        }

    }
    public checkIsAllSelect(controlName: string, value: boolean) {
        if (this.advertisingServicesGroupArray && this.advertisingServicesGroupArray.controls && this.advertisingServicesGroupArray.controls.length) {
            let count: number = 0
            for (let item of this.advertisingServicesGroupArray.controls) {
                if (item.get(controlName).value == value) {
                    count++
                }
            }
            if (count == this.advertisingServicesGroupArray.controls.length) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

    }
    public selectAll(name: string, value: boolean) {
        if (this.advertisingServicesGroupArray && this.advertisingServicesGroupArray.controls) {
            for (let item of this.advertisingServicesGroupArray.controls) {
                item.get(name).setValue(value)
            }
        }

    }
    public setValue(event, controlName: string, form: FormGroup): void {
            form.get(controlName).setValue(event);
            this.onFocus(form,controlName)

    }
    public setInputValue(controlName: string, property: string, form: FormGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus( form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
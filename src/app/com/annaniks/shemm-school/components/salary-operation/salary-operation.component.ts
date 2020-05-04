import { Component, Input } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ComponentDataService, AppService } from '../../services';
import { AccountPlans } from '../../models/global.models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-salary-operation',
    templateUrl: 'salary-operation.component.html',
    styleUrls: ['salary-operation.component.scss']
})
export class SalaryOperationComponent {

    public chartAccounts: AccountPlans[] = [];
    private _subscription: Subscription
    public operationFormArray: FormArray
    public totalSum: number = 0;


    @Input('chartAccounts')
    set setChartAccount($event: AccountPlans[]) {
        this.chartAccounts = $event
    }

    @Input('group')
    set setFormGroup($event) {        
        if ($event && $event.length) {
            this.operationFormArray = this._fb.array([]);
            $event.forEach(element => {
                this.operationFormArray.push(element);                
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
                if (this.operationFormArray) {
                    let isValid = this.operationFormArray && this.operationFormArray.valid ? true : false;
                    this._componentDataService.sendData(this.operationFormArray.controls, 'operation', isValid)
                }
            }
        })
    }


    private _validate(): void {
        this.operationFormArray = this._fb.array([])
    }

    public calculateTotalSum(): number {
        let sum: number = 0
        if (this.operationFormArray && this.operationFormArray.controls) {
            for (let item of this.operationFormArray.controls) {
                if (item.get('amountInDram').value) {
                    sum += (item.get('amountInDram').value) ? +item.get('amountInDram').value : 0
                }
            }
        }
        return sum
    }
  
    public setValue(event, controlName: string, form: FormGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)

    }
    public setModalParams(title: string, codeKeyName: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }

    public setInputValue(controlName: string, property: string, form: FormGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
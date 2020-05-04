import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AnalyticalGroup, Partner, AccountPlans, AccountPlan } from '../../models/global.models';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-currency-account-operation',
    templateUrl: 'currency-account-operation.component.html',
    styleUrls: ['currency-account-operation.component.scss']
})
export class CurrencyAccountOperationComponent {
    public currencyAccountOperationGroup: FormGroup;
    public operationArray = [];
    private _subscription: Subscription
    public chartAccounts:AccountPlan[]=[]

    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.currencyAccountOperationGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.currencyAccountOperationGroup);
        }
    }
    @Input('chartAccounts')
    set setAccount($event:AccountPlan[]){
        this.chartAccounts=$event
    }
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.currencyAccountOperationGroup.valid ? true : false
                this._componentDataService.sendData(this.currencyAccountOperationGroup.value, 'accountOperation', isValid)
            }
        })

    }

    private _validate() {
        this.currencyAccountOperationGroup = this._fb.group({
            date: [null],
            correspondentAccount: [null],
            account: [null],
        })
    }
    
    public setValue(event, controlName: string, form: FormGroup = this.currencyAccountOperationGroup): void {
            form.get(controlName).setValue(event);
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.currencyAccountOperationGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }

    public setModalParams(title: string, keyName: string, codeKeyName: string) {
        let modalParams = { tabs: [keyName, 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
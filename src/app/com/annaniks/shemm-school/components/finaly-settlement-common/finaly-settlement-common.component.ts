import { Component, Input, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountPlan, Provisions } from '../../models/global.models';
import { AppService, ComponentDataService, OftenUsedParamsService } from '../../services';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-finaly-settlement-common',
    templateUrl: 'finaly-settlement-common.component.html',
    styleUrls: ['finaly-settlement-common.component.scss']
})
export class FinalySettlementCommonComponent {
    public finalySettlementGroup: FormGroup;
    private _subscription: Subscription;
    public chartAccounts: AccountPlan[] = [];
    private _totalSum: number = 0;
    private _cofficient: number;
   
    @Input('provisions')
    set setProvisions($event: Provisions) {
        if ($event) {
            this._cofficient = +$event.averageDailyCoefficientVacation
            this.finalySettlementGroup.get('dailyCoefficient').setValue(this._cofficient)
        }
    }

    @Input('chartAccounts')
    set setChartAccount($event: AccountPlan[]) {
        this.chartAccounts = $event
    }
 
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.finalySettlementGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.finalySettlementGroup);
            if (this._cofficient) {
                this.finalySettlementGroup.get('dailyCoefficient').setValue(this._cofficient)
            }
        }
    }
    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _datePipe: DatePipe,
        private _oftenUsedParamsService:OftenUsedParamsService,
        @Inject('CALENDAR_CONFIG') public calendarConfig) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                this._sendData()
            }
        })
    }
    private _sendData() {
        if (this.finalySettlementGroup) {
            let isValid =  this.finalySettlementGroup.valid;
            this._componentDataService.sendData(this.finalySettlementGroup.value, 'general', isValid);
        }

    }

    private _validate(){
        this.finalySettlementGroup=this._fb.group({
            monthCount:[12],
            dailyCoefficient:[null],
            averageSalary:[null],
            averageDaily:[null],
            expenseAccount:[null],
            day:[null],
            amount:[null,Validators.required]
        })
    }
    public setValue(event, controlName: string, form: FormGroup = this.finalySettlementGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)

    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.finalySettlementGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
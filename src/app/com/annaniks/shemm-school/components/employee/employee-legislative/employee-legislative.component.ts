import { Component, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Partners } from '../../../models/global.models';
import { LoadingService, AppService, ComponentDataService } from '../../../services';

@Component({
    selector: 'app-employee-legislative',
    templateUrl: 'employee-legislative.component.html',
    styleUrls: ['employee-legislative.component.scss']
})
export class EmployeeLegislativeComponent {
    public employeeGroup: FormGroup;
    public partners: Partners[] = [];
    private _subscription: Subscription;
    public isFocus: boolean = false;
    @Input('partners')
    set setPartners($event) {
        this.partners = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.isFocus = true
            this._appService.markFormGroupTouched(this.employeeGroup)
            this.employeeGroup.patchValue($event)
        }
    }
    public modalParams = {
        tabs: ['Կոդ', 'Անվանում', 'ՀՎՀՀ', 'Էլ․ փոստ', 'Հեռախոսահամար', 'Պայմանագիր'], title: 'Գործընկերներ', keys: ['id', 'name', 'hvhh',
            'email', 'phone', 'contract']
    }
    public modalParams2 = {
        tabs: ['Կոդ', 'Անվանում'], title: 'Մասնակցության կարգավիճակներ', keys: ['id', 'name']
    }
    constructor(private _fb: FormBuilder, private _matDialog: MatDialog, private _loadingService: LoadingService,
        private _componentDataService: ComponentDataService, private _appService: AppService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                // this.isFocus = true
                // this._appService.markFormGroupTouched(this.employeeGroup)
                // let isValid = this.employeeGroup.valid ? true : false
                // this._componentDataService.sendData(this.employeeGroup.value, 'legislative', isValid)
            }
        })
    }

    private _validate() {
        this.employeeGroup = this._fb.group({
            sitizen_RA: [null],
            income_tax_withheld: [null],
            reduce_cumulative_amount_from_income_tax: [null],
            payroll_accounting: [null],
            partner: [null],
            // this._fb.array([this._fb.group({ partner: [null, Validators.required] })]),
            percentage_of_trade_union_membership_fee: [null],
            participation_status: [null, Validators.required],
            employee_amount: [null],
            employee_percent: [null],
            marking_board: [null, Validators.required]
        })
    }
    public participationOnFocus($event) {
        this.isFocus = $event
    }

    public setValue(event, controlName: string) {
            this.employeeGroup.get(controlName).setValue(event);
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.employeeGroup, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
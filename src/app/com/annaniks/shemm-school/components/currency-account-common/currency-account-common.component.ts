import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AnalyticalGroup, AccountPlans, Partner, ShortModel, Table } from '../../models/global.models';
import { SelectDocumentTypeModal } from '../../modals';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-currency-account-common',
    templateUrl: 'currency-account-common.component.html',
    styleUrls: ['currency-account-common.component.scss']
})
export class CurrencyAccountCommonComponent {
    public currencyAccountGroup: FormGroup;
    public listArray: FormArray;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    public chartAccounts: AccountPlans[] = [];
    public subdivisions: ShortModel[] = []
    public operationFormArray: FormArray
    public totalSum: number = 0;
    private _subscription: Subscription;
    public documentKind = []
    public tables: Table[] = []
    @Input('subdivisions')
    set setSubdivisions($event: ShortModel[]) {
        this.subdivisions = $event
    }

    @Input('chartAccounts')
    set setChartAccount($event: AccountPlans[]) {
        this.chartAccounts = $event
    }
    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event: AnalyticalGroup[]) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event: AnalyticalGroup[]) {
        this.analyticalGroup2 = $event
    }
    @Input('tables')
    set setTable($event: Table[]) {
        this.tables = $event
    }
    @Input('group')
    set setFormGroup($event) {        
        if ($event) {
            this.currencyAccountGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.currencyAccountGroup);
            if ($event.listArray && $event.listArray.length) {
                (this.currencyAccountGroup.controls.listArray as FormArray) = this._fb.array([])
                $event.listArray.forEach(element => {
                    (this.currencyAccountGroup.get('listArray') as FormArray).push(element)
                    this._appService.markFormGroupTouched(element);
                });

            }
        }
    }
    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService
    ) {
        this._validate();
        this.documentKind = this._appService.getDocumentKind()

    }


    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.currencyAccountGroup) {
                    let isValid = this.currencyAccountGroup.valid ? true : false;
                    this._componentDataService.sendData(this.currencyAccountGroup, 'general', isValid);
                }
            }
        })
    }

    private _validate() {
        this.currencyAccountGroup = this._fb.group({
            paymentType: [null, Validators.required],
            unit: [null],
            analyticGroup1: [null],
            analyticGroup2: [null],
            paymentAccount: [null, Validators.required],
            comment: [null],
            listArray: this._fb.array([this._fb.group({
                unit: [null],
                reportCard: [null],
                name: [null],
                byHands: [0],
                paidAmount: [0],
            })])
        })
    }


    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.currencyAccountGroup.get('listArray') as FormArray;
            formArray.push(this._fb.group({
                unit: [null],
                reportCard: [null],
                name: [null],
                byHands: [0],
                paidAmount: [0],
            }))
        }
    }

    public remove(index: number): void {
        let formArray = this.currencyAccountGroup.get('listArray') as FormArray;
        formArray.removeAt(index)
    }
    public deleteAll(event: boolean): void {
        let formArray = this.currencyAccountGroup.get('listArray') as FormArray;
        if (event && formArray && formArray.length) {
            let index = formArray.length - 1;
            formArray.removeAt(index)
        }
    }

    public setValue(event, controlName: string, form: FormGroup = this.currencyAccountGroup): void {
            form.get(controlName).setValue(event);
            this.onFocus(form,controlName)
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.currencyAccountGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    public setModalParams(title: string, keyName: string, codeKeyName: string) {
        let modalParams = { tabs: [keyName, 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }
    public onFocus( form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
      }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

}
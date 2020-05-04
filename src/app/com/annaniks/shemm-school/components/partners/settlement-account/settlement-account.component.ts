import { Component, Input } from "@angular/core";
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ComponentDataService, AppService } from '../../../services';
import { Subscription } from 'rxjs';
import { DeletedFormArrayModel, Currency } from '../../../models/global.models';
import { MainService } from '../../../views/main/main.service';

@Component({
    selector: 'app-settlement-account',
    templateUrl: 'settlement-account.component.html',
    styleUrls: ['settlement-account.component.scss']
})
export class SettlementAccountComponent {
    public settlementAccountGroupArray: FormArray = this._fb.array([]);
    private _subscription: Subscription;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    public currencies: Currency[] = []
    @Input('currencies')
    set setCurrency($event: Currency[]) {
        this.currencies = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.settlementAccountGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.settlementAccountGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });
        }
    }
    constructor(private _fb: FormBuilder,
        private _mainService: MainService,
        private _componentDataService: ComponentDataService, private _appService: AppService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.settlementAccountGroupArray) {
                    let isValid = this.settlementAccountGroupArray && this.settlementAccountGroupArray.valid ? true : false;
                    this._componentDataService.sendData(this.settlementAccountGroupArray.controls, 'settlementAccount', isValid, this._deletedGroupsArray)
                    this._deletedGroupsArray = []
                }
            }
        })
    }
    private _validate(): void {
        this.settlementAccountGroupArray = this._fb.array([])
    }
    public getBankName(item: FormGroup) {
        let bankName = this._mainService.getBankName(item, 'account');
        item.get('name').setValue(bankName)
    }
    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.settlementAccountGroupArray as FormArray;
            formArray.push(this._fb.group({
                account: [null, Validators.required],
                name: [null, Validators.required],
                isMain: [false],
                currency:[null],
                id: [null]
            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.settlementAccountGroupArray as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index)
    }

    public deleteAll(event: boolean): void {
        let formArray = this.settlementAccountGroupArray as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(formArray.length - 1)
        }
    }
    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public setValue(event, controlName: string, form: FormGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
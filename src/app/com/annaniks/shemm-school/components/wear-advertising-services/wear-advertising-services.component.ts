import { Component, Input } from "@angular/core";
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';
import { AccountPlan } from '../../models/global.models';

@Component({
    selector: 'app-wear-advertising-services',
    templateUrl: 'wear-advertising-services.component.html',
    styleUrls: ['wear-advertising-services.component.scss']
})
export class WearAdvertisingservicesComponent {
    private _subscription: Subscription;
    public wearAdvertisingServicesGroupArray: FormArray;

    @Input('chartAccounts') public chartAccounts: AccountPlan[];
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.wearAdvertisingServicesGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.wearAdvertisingServicesGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });
        }
    }

    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService
    ) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.wearAdvertisingServicesGroupArray.valid ? true : false;
                this._componentDataService.sendData(this.wearAdvertisingServicesGroupArray.controls, 'advertisingServices', isValid)
            }
        })
    }

    private _validate() {
        this.wearAdvertisingServicesGroupArray = this._fb.array([
            this._fb.group({
                inventory: [null, Validators.required],
                name: [null, Validators.required],
                expenseAccount: [null, Validators.required],
                incomeAccount: [null, Validators.required]
            })
        ])
    }

    public addRow(event: boolean) {
        if (event) {
            let formArray = this.wearAdvertisingServicesGroupArray as FormArray;
            formArray.push(this._fb.group({
                inventory: [null, Validators.required],
                name: [null, Validators.required],
                expenseAccount: [null, Validators.required],
                incomeAccount: [null, Validators.required]
            }))
        }
    }

    public remove(index: number) {
        let formArray = this.wearAdvertisingServicesGroupArray as FormArray;
        formArray.removeAt(index)
    }

    public deleteAll(event: boolean): void {
        let formArray = this.wearAdvertisingServicesGroupArray as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            formArray.removeAt(index)
        }

    }

    public setValue(event, item: FormGroup, key): void {
            item.get(key).setValue(event);
            this.onFocus(item,key)

    }

    public setInputValue(item, controlName: string, property: string) {
        return this._appService.setInputValue(item, controlName, property)
    }

    public setModalParams(title: string, propertyTitle: string, property: string) {
        let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }
    
    public onFocus( form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
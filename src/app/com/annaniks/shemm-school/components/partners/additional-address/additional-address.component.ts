import { Component, Inject, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ComponentDataService, AppService } from '../../../services';
import { Subscription } from 'rxjs';
import { DeletedFormArrayModel } from '../../../models/global.models';

@Component({
    selector: 'app-additional-address',
    templateUrl: 'additional-address.component.html',
    styleUrls: ['additional-address.component.scss']
})
export class AdditionalAddressComponent {
    public additionalAddressGroupArray: FormArray = this._fb.array([]);
    private _subscription: Subscription;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.additionalAddressGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.additionalAddressGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });

        }
    }

    constructor(private _fb: FormBuilder, private _componentDataService: ComponentDataService, private _appService: AppService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.additionalAddressGroupArray.valid && this.additionalAddressGroupArray.valid ? true : false;
                this._componentDataService.sendData(this.additionalAddressGroupArray.controls, 'aditionalAddress', isValid, this._deletedGroupsArray)
                this._deletedGroupsArray = []
            }
        })
    }
    private _validate(): void {
        this.additionalAddressGroupArray = this._fb.array([])
    }
    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.additionalAddressGroupArray as FormArray;
            formArray.push(this._fb.group({
                name: [null, Validators.required],
                id: [null]
            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.additionalAddressGroupArray as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index);
    }

    public deleteAll(event: boolean): void {
        let formArray = this.additionalAddressGroupArray as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(index)
        }

    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
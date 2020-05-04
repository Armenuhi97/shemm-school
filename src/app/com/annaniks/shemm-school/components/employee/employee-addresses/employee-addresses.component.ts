import { Component, Input } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComponentDataService } from '../../../services';
import { Subscription } from 'rxjs';
import { ShortModel } from '../../../models/global.models';

@Component({
    selector: 'app-employee-addresses',
    templateUrl: 'employee-addresses.component.html',
    styleUrls: ['employee-addresses.component.scss']
})
export class EmployeeAddressesComponent {
    public employeeGroup: FormGroup;
    private _subscription: Subscription;

    @Input('regions') public regions: ShortModel[];
    @Input('communities') public communities: ShortModel[];
    @Input('countries') public countries: Array<{ name: string }>;
    // @Input('postNumbers') public postNumbers: ShortModel[];

    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.employeeGroup.patchValue($event)
        }
    }
    constructor(private _fb: FormBuilder, private _componentDataService: ComponentDataService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.employeeGroup.valid ? true : false
                this._componentDataService.sendData(this.employeeGroup.value, 'address', isValid)
            }
        })
    }
    private _validate(): void {
        this.employeeGroup = this._fb.group({
            registration: this._fb.group({
                place: [false],
                region: [null],
                community: [null],
                city: [null],
                street: [null],
                home: [null],
                apartment: [null],
            }),

            isResidence: [false],
            residence: this._fb.group({
                region: [null],
                place: [false],
                community: [null],
                city: [null],
                street: [null],
                home: [null],
                apartment: [null],
                country: [null],
                address1: [null],
                address2: [null],
                address3: [null],
                post: [null]
            })
        })
        this.employeeGroup.get('isResidence').valueChanges.subscribe((data) => {
            if (data) {
                this.employeeGroup.get('residence').reset()
                this.employeeGroup.get('residence').patchValue(this.employeeGroup.get('registration').value);

            }else{
                this.employeeGroup.get('residence').reset()

            }
        })
        this.employeeGroup.get('registration').valueChanges.subscribe((data) => {
            if (this.employeeGroup.get('isResidence').value) {
                this.employeeGroup.get('residence').reset()
                this.employeeGroup.get('residence').patchValue(this.employeeGroup.get('registration').value);
            }
        })
    }
    public getFormGroupName(name: string) {
        return this.employeeGroup.get(name)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
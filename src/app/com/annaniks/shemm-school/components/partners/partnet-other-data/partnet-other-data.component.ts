import { Component, Inject, Input } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComponentDataService } from '../../../services';

@Component({
    selector: 'app-partnet-other-data',
    templateUrl: 'partnet-other-data.component.html',
    styleUrls: ['partnet-other-data.component.scss']
})
export class PartnertherDataComponent {
    public partnerGroup: FormGroup;
    private _subscription: Subscription;
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.partnerGroup.patchValue($event)
        }
    }
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb: FormBuilder, private _componentDataService: ComponentDataService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.partnerGroup.valid ? true : false
                this._componentDataService.sendData(this.partnerGroup.value, 'other', isValid)
            }
        })
    }
    private _validate() {
        this.partnerGroup = this._fb.group({
            otherData: [null],
            deliveryMethod: [null],
            fullName: [null],
            attorneyPowerNumber: [null],
            attorneyPowerDate: [null]
        })
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
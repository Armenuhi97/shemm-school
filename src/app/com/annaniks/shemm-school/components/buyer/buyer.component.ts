import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-buyer',
    templateUrl: 'buyer.component.html',
    styleUrls: ['buyer.component.scss']
})
export class BuyerComponent {
    public isAdditionally: boolean = false
    public buyerGroup: FormGroup;
    constructor(private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig) { }
    ngOnInit() {
        this._validate()
    }
    private _validate() {
        this.buyerGroup = this._fb.group({
            name: [null],
            legal_address: [null],
            work_address: [null],
            settlement_account: [null],
            hvhh: [null],
            head_position: [null],
            head_fullName: [null],
            accountant_position: [null],
            accountant_fullName: [null],
            more_info: [null],
            registration_certificate_number: [null],
            passport_number: [null],
            delivery_method: [null],
            full_name: [null],
            power_attorney: [null],
            date_power_attorney: [null]
        })
    }
    public openOrCloseAdditionalInfo() {
        this.isAdditionally = !this.isAdditionally
    }
    public arrowStyle() {
        let style = {}
        if (this.isAdditionally) {
            style['transform'] = "rotate(180deg)"
        }
        return style
    }
}
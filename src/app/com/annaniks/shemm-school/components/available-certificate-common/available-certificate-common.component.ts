import { Component } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-available-certificate-common',
    templateUrl: 'available-certificate-common.component.html',
    styleUrls: ['available-certificate-common.component.scss']
})
export class AvailableCertificateComponent {
    public isAdditionally: boolean = false;
    public certificateGroup: FormGroup
    constructor(private _fb: FormBuilder) { }
    ngOnInit(){
        this._validate()
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
    private _validate(){
        this.certificateGroup=this._fb.group({
            warehouse:[null],
            group:[null],
            material_cost:[null],
            various_accounts:[null],
            account:[null],
            different_parties:[null],
            minimal_count:[null],
            isShowSlePrice:[null],
            currency:[null],
            isShowAAHAmount:[null],
            subs:[null]
        })

    }
}
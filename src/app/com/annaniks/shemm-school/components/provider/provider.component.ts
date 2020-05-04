import { Component } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-provider',
    templateUrl: 'provider.component.html',
    styleUrls: ['provider.component.scss']
})
export class ProviderComponent {
    public providerGroup: FormGroup;
    constructor(private _fb: FormBuilder) { }
    ngOnInit() {
        this._validate()
    }
    private _validate() {
        this.providerGroup = this._fb.group({
            name: [null],
            legal_address: [null],
            work_address: [null],
            settlement_account: [null],
            hvhh: [null],
            head_position: [null],
            head_fullName: [null],
            accountant_position: [null],
            accountant_fullName: [null],
            more_info: [null]
        })
    }
}
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-balance-common',
    templateUrl: 'balance-common.component.html',
    styleUrls: ['balance-common.component.scss']
})
export class BalanceCommonComponent {
    public balanceCommonGroup: FormGroup;
    constructor(private _fb: FormBuilder) { }
    ngOnInit() {
        this._validate()
    }
    private _validate() {
        this.balanceCommonGroup = this._fb.group({
            account: [null],
            currency: [null],
            report_currency: [null, Validators.required],
            division_supplies_account: [null, Validators.required],
            isShow_last_level_accounts:[false],
            isShowNames:[false],
            isShowPartners:[false],
            isShowAnalyticGroup1:[false],
            isShowAnalyticGroup2:[false],
            isShowZeroLines:[false],
            treeSpecies:[false]
        })
    }
}
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-revaluation-common',
    templateUrl: 'revaluation-common.component.html',
    styleUrls: ['revaluation-common.component.scss']
})
export class RevaluationCommonComponent {
    public commonGroup: FormGroup;
    private _subscription: Subscription;

    public financeTitles = ['Ֆինանսական', 'Հին', 'Նոր'];
    public taxTitles = ['Հարկային', 'Հին', 'Նոր'];
    public revenueTitles = ['Հետ․ հասույթ', 'Հին', 'Նոր'];
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.commonGroup.patchValue($event)
            this._appService.markFormGroupTouched(this.commonGroup)
        }
    }
    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.commonGroup) {
                    let isValid = this.commonGroup && this.commonGroup.valid ? true : false;
                    this._componentDataService.sendData(this.commonGroup.value, 'general', isValid)
                }
            }
        })
    }
    private _validate() {
        this.commonGroup = this._fb.group({
            taxResidualUsefulLifeOld: [null],
            taxResidualUsefulLifeNew: [null],
            taxInitialCostOld: [null],
            taxInitialCostNew: [null],
            taxCalculatedWearOld: [null],
            taxCalculatedWearNew: [null],
            taxResidualValueOld: [null],
            taxResidualValueNew: [null],

            revenueResidualUsefulLifeOld: [null],
            revenueResidualUsefulLifeNew: [null],
            revenueInitialCostOld: [null],
            revenueInitialCostNew: [null],
            revenueCalculatedWearOld: [null],
            revenueCalculatedWearNew: [null],
            revenueResidualValueOld: [null],
            revenueResidualValueNew: [null],


            financeResidualUsefulLifeOld: [null],
            financeResidualUsefulLifeNew: [null],
            financeInitialCostOld: [null],
            financeInitialCostNew: [null],
            financeCalculatedWearOld: [null],
            financeCalculatedWearNew: [null],
            financeResidualValueOld: [null],
            financeResidualValueNew: [null],

        })
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
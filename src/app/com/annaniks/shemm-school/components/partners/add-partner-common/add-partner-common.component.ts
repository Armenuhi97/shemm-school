import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentDataService, AppService } from '../../../services';
import { AccountPositionModel, HeadPositionModel } from '../../../models/global.models';

@Component({
    selector: 'app-add-partner-common',
    templateUrl: 'add-partner-common.component.html',
    styleUrls: ['add-partner-common.component.scss']
})
export class AddPartnerCommonComponent {
    public partnerCommonGroup: FormGroup;
    private _subscription: Subscription;
    public headPositions: HeadPositionModel[] = [];
    public accountPositions: AccountPositionModel[] = []
    @Input('headPosition')
    set setHeadPosition($event: HeadPositionModel[]) {
        this.headPositions = $event
    }

    @Input('accountPosition')
    set setAccountPosition($event: AccountPositionModel[]) {
        this.accountPositions = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.partnerCommonGroup.patchValue($event)
        }
    }
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb: FormBuilder, private _componentDataService: ComponentDataService,
        private _appService: AppService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.partnerCommonGroup.valid ? true : false
                this._componentDataService.sendData(this.partnerCommonGroup.value, 'common', isValid)
            }
        })
    }
    private _validate(): void {
        this.partnerCommonGroup = this._fb.group({
            isAAHpayer: [false],
            legalAddress: [null],
            worksAddress: [null],
            directorFullName: [null],
            headPosition: [null],
            accountantFullName: [null],
            accountantPosition: [null],
            certificate: [null],
            passportNumber: [null],
            purposePayment: [null],
            phone: [null],
            email: [null, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)],
            contract: [null],
            contract_date: [null],
            discountPercentageSale: [null]
        })
    }
    public setValue(event, controlName: string) {
        this.partnerCommonGroup.get(controlName).setValue(event);
        this.onFocus(this.partnerCommonGroup,controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.partnerCommonGroup, controlName, property)
    }
    public setModalParams(title: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: ['id', 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
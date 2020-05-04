import { Component, Inject, EventEmitter, Output, Input } from "@angular/core";
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService, ComponentDataService } from '../../../services';
import { AddPartnerModal } from '../../../views/main/main-accounting/modals';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Partner, AnalyticalGroup, AccountPlan, Currency } from '../../../models/global.models';
import { SelectDocumentTypeModal } from '../../../modals';
import { Router } from '@angular/router';

@Component({
    selector: 'app-receive-service-common',
    templateUrl: 'receive-service-common.component.html',
    styleUrls: ['receive-service-common.component.scss']
})
export class ReceiveServiceCommonComponent {
    public receiveServicesGroup: FormGroup;
    private _subscription: Subscription;
    public partners: Partner[] = [];
    public documentKind: Array<{ text: string, id: number }> = []
    public currencies: Currency[] = []
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    public chartAccount: AccountPlan[] = []
    @Output('isClickOnAddButton') private _isClick: EventEmitter<{ isClick: boolean, isValue: boolean }> = new EventEmitter()
    @Input('group')
    set getFormGroup($event) {
        if ($event) {
            this.receiveServicesGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.receiveServicesGroup)
        }
    }
    @Input('partners')
    set setPartners($event: Partner[]) {
        if ($event)
            this.partners = $event;
    }
    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event: AnalyticalGroup[]) {
        if ($event)
            this.analyticalGroup1 = $event;
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event: AnalyticalGroup[]) {
        if ($event)
            this.analyticalGroup2 = $event;
    }
    @Input('chartAccounts')
    set setChartAccount($event: AccountPlan[]) {
        if ($event)
            this.chartAccount = $event;
    }
    @Input('currencyArray')
    set setCurrency($event: Currency[]) {
        this.currencies = $event
    }
    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject('URL_NAMES') private _urls, private _matDialog: MatDialog,
        private _componentDataService: ComponentDataService,
        private _router:Router) {
        this._validate();
        this.documentKind = this._appService.getDocumentKind()

    }

    ngOnInit() {
        this.sendData()
    }
    private sendData() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.receiveServicesGroup.valid ? true : false
                this._componentDataService.sendData(this.receiveServicesGroup.value, 'general', isValid)
            }
        })
    }
    private _validate() {
        this.receiveServicesGroup = this._fb.group({
            currency: [null, Validators.required],
            exchangeRate: [null, Validators.required],
            exchangeRateFrom: [null],
            previousDayCourse: [false],
            provider: [null, Validators.required],
            providerAccount: [null],
            givenAdvancePaymentAccount: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            dischargeMethod: ['էլեկտրոնային'],
            acquisitionDocumentNumber: [null],
            date: [null],
            comment: [null]
        })

    }
    public addPartner() {
        this._isClick.emit({ isClick: false, isValue: false })
        this._subscription.unsubscribe();
        let title = 'Գործընկերներ (Նոր)';
        let dialog = this._matDialog.open(AddPartnerModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            data: { title: title, url: this._urls.partnerGetOneUrl },
            autoFocus: false,

        })
        dialog.afterClosed().subscribe((data) => {
            this.sendData();
            if (data) {
                if (data.value) {
                    this._isClick.emit({ isClick: true, isValue: true })

                } else {
                    this._isClick.emit({ isClick: true, isValue: false })
                }
            } else {
                this._isClick.emit({ isClick: true, isValue: false })
            }
        })
    }
    public setValue(event, controlName: string) {
        this.receiveServicesGroup.get(controlName).setValue(event);
        this.onFocus(this.receiveServicesGroup,controlName)

    }
    public setModalParams(title: string, key: string, firstRowTitle: string) {
        let modalParams = { tabs: [firstRowTitle, 'Անվանում'], title: title, keys: [key, 'name'] };
        return modalParams
    }
    public setCommentParam(keys: Array<string>) {
        let modalParams = { keys: keys };
        return modalParams
    }
    public onFocus(form: FormGroup, controlName: string) {        
        form.get(controlName).markAsTouched()
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.receiveServicesGroup, controlName, property)
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
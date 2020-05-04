import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from '../../../services';
import { AnalyticalGroup, Partners, AccountPlans, WareHouse, WarehouseAcquistion } from '../../../models/global.models';
import { AddPartnerModal } from '../../../views/main/main-accounting/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-enter-vault-common',
    templateUrl: 'enter-vault-common.component.html',
    styleUrls: ['enter-vault-common.component.scss']
})
export class EnterVaultCommonComponent {
    public enterVaultCommonGroup: FormGroup;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    private _selectedWarehouseAcquistion:WarehouseAcquistion;
    public partners: Partners[] = [];
    public subsection = [];
    public accounts: AccountPlans[] = []
    @Output('isClickOnAddButton') private _isClick: EventEmitter<{ isClick: boolean, isValue: boolean }> = new EventEmitter()
    @Input('chartAccounts')
    set setAccounts($event: AccountPlans[]) {
        this.accounts = $event
    }

    @Input('group')
    set getFormGroup($event) {
        if ($event) {
            this.enterVaultCommonGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.enterVaultCommonGroup)
        }
    }
    // @Input('selectedWareHouseAcquistion')
    // set setSelectedWareHouseAcquistion($event:WarehouseAcquistion) {
    //     if ($event) {
    //         this._selectedWarehouseAcquistion = $event
    //         this._setDefaultValue()
    //     }
    // }

    @Input('partners')
    set setPartners($event) {
        this.partners = $event
    }
    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event) {
        this.analyticalGroup2 = $event
    }
    constructor(private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig, private _componentDataService: ComponentDataService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _appService: AppService, @Inject('URL_NAMES') private _urls, private _matDialog: MatDialog, private _loadingService: LoadingService
    ) {
        this._validate()
    }

    ngOnInit() {
        this.sendData()
    }
    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    // private _setDefaultValue() {
    //     if (this._selectedWarehouseAcquistion) {
    //         if (this._selectedWarehouseAcquistion.id !== this._oftenUsedParamsService.getPreviousValue()) {
    //             this.enterVaultCommonGroup.patchValue({
    //                 // providerAccount: (this._selectedWarehouse.warehouseSignificance && this._selectedWarehouse.warehouseSignificance.partnerAccountId) ? this._appService.checkProperty(this._appService.filterArray(this.accounts, this._selectedWarehouse.warehouseSignificance.partnerAccountId, 'id'), 0) : null,
    //                 givenAdvancePaymentAccount: (this._selectedWarehouseAcquistion.prepaymentAccountId) ? this._selectedWarehouseAcquistion.prepaymentAccount : null
    //             })
    //         }
    //         this._oftenUsedParamsService.setPreviousValue(this._selectedWarehouseAcquistion.id)
    //     }
    // }
    public setAccountModalParams(title: string) {
        let modalParams = { tabs: ['Հաշիվ', 'Անվանում'], title: title, keys: ['account', 'name'] };
        return modalParams
    }
    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }

    private sendData() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.enterVaultCommonGroup.valid ? true : false
                this._componentDataService.sendData(this.enterVaultCommonGroup.value, 'general', isValid)
            }
        })
    }
    private _validate() {
        this.enterVaultCommonGroup = this._fb.group({
            provider: [null, Validators.required],
            // name: [null],
            // subsection: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            // dischargeMethod: [null],
            acquisitionDocumentNumber: [null],
            date: [null],
            comment: [null],
            // providerAccount: [null],
            // prepaymentAccountReceived: [null],
            // givenAdvancePaymentAccount: [null]
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
        this.enterVaultCommonGroup.get(controlName).setValue(event);
        this.onFocus(this.enterVaultCommonGroup, controlName)
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.enterVaultCommonGroup, controlName, property)
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
import { Component, Inject } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { AccountPlans, ServerResponse, ModalDataModel, DataCount, BankPayload, Currency, BankAccount } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { switchMap, map } from 'rxjs/operators';

@Component({
    selector: 'add-bank-account-modal',
    templateUrl: 'add-bank-account.modal.html',
    styleUrls: ['add-bank-account.modal.scss']
})
export class AddBankAccountModal {
    public title: string;
    public bankAccountGroup: FormGroup;
    private _subscription: Subscription;
    public accountPlans: AccountPlans[] = [];
    public banks: BankPayload[] = [];
    public currencies: Currency[] = []
    constructor(private _dialogRef: MatDialogRef<AddBankAccountModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _fb: FormBuilder, private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        @Inject('URL_NAMES') private _urls,
        private _mainService: MainService, private _appService: AppService) { }
    ngOnInit() {
        this.title = this._data.title
        this._validate()
    }
    private _validate() {
        this.bankAccountGroup = this._fb.group({
            settlementAccount: [null, Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12)])],
            name: [null, Validators.required],
            currency: [null],
            isMain: [false],
            account: [null]
        })
        this._combineObservable()
    }
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._mainService.getAccountsPlan(),
            this._mainService.getBankCount(),
            this._mainService.getCurrenciesCount()
        )
        this._subscription = combine.subscribe(() => {
            this.accountPlans = this._oftenUsedParamsService.getChartAccounts();
            this.currencies = this._oftenUsedParamsService.getCurrency();
            this.banks = this._oftenUsedParamsService.getBank()
            this._loadingService.hideLoading()
            this._getBankAccountById()
        })
    }


    private _getBankAccountById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<BankAccount>) => {
                let bankAccount = data.data
                this.bankAccountGroup.patchValue({
                    settlementAccount: bankAccount.billingAccount,
                    name: bankAccount.name,
                    currency: (bankAccount && bankAccount.currencies) ? bankAccount.currencies : null,
                    isMain: this._appService.getBooleanVariable(bankAccount.isMain),
                    account: (bankAccount && bankAccount.accounts) ? bankAccount.accounts : null
                })
                this._loadingService.hideLoading()
            })
        } else {
            this._loadingService.hideLoading()

        }

    }
    public getBankName() {
        let bankName = this._mainService.getBankName(this.bankAccountGroup, 'settlementAccount');
        this.bankAccountGroup.get('name').setValue(bankName)
    }
    public close() {
        this._dialogRef.close()
    }
    public setAccountModalParams(title: string) {
        let modalParams = { tabs: ['Հաշիվ', 'Անվանում'], title: title, keys: ['account', 'name'] };
        return modalParams
    }
    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }
    public setValue(event, controlName: string) {
        this.bankAccountGroup.get(controlName).setValue(event);
        this.onFocus(this.bankAccountGroup, controlName)
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.bankAccountGroup, controlName, property)
    }
    public setModalParams(title: string, keysArray: Array<string>, titlesArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }
    public save() {
        if (this.bankAccountGroup.valid) {
            this._loadingService.showLoading()
            let sendObject = {
                billingAccount: this.bankAccountGroup.get('settlementAccount').value,
                name: this.bankAccountGroup.get('name').value,
                accountId: this._appService.checkProperty(this.bankAccountGroup.get('account').value, 'account'),
                currencyId: this._appService.checkProperty(this.bankAccountGroup.get('currency').value, 'id'),
                isMain: this.bankAccountGroup.get('isMain').value
            }

            if (!this._data.id) {
                this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                    this._dialogRef.close({ value: true })
                    this._loadingService.hideLoading()
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            } else {
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id });
                    this._loadingService.hideLoading()
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            }
        }

    }
    ngOnDestroy() {
        this._loadingService.hideLoading();
        this._subscription.unsubscribe()
    }
}
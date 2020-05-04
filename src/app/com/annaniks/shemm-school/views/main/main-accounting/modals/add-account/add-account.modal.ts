import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, DataCount, AccountPlans, Currency, AccountPlan } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ChartAccountsService } from '../../pages/chart-accounts/chart-accounts.service';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-account-modal',
    templateUrl: 'add-account.modal.html',
    styleUrls: ['add-account.modal.scss']
})
export class AddAccountModal {
    public title: string;
    public accountGroup: FormGroup;
    private _subscription: Subscription;
    public types: Array<{ name: string, code: string, key: string }> = []
    public currencyArray: Currency[] = [];
    public chartAccounts: AccountPlans[] = []
    private _currencyIds: Currency[] = [];
    private _error: string;
    public modalParams = { tabs: ['Հաշիվ', 'Անվանում'], title: this._data.title, keys: ['account', 'name'] }
    public typesModalPrams = { tabs: ['Կոդ', 'Անվանում'], title: 'Հաշվի տիպեր', keys: ['code', 'name'] }
    constructor(private _dialogRef: MatDialogRef<AddAccountModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _fb: FormBuilder, private _loadingService: LoadingService,
        private _appService: AppService, private _mainService: MainService, private _chartAccountService: ChartAccountsService,
        @Inject('URL_NAMES') private _urls,
        private _messageService: MessageService,
    ) {
        this.title = this._data.title;
    }

    ngOnInit() {
        this._validate()
    }

    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getCurrenciesCount(),
            this._getChartAccountsCount()
        )
        this._subscription = combine.subscribe(() => {
            this.types = [{ name: 'Ակտիվային', code: '1', key: 'Ա' }, { name: 'Պասիվային', code: '2', key: 'Պ' }, { name: 'Ակտիվային կամ Պասիվային', code: '3', key: 'Ա/Պ' }]
            this._loadingService.hideLoading()
        }
            // , () => { this._loadingService.hideLoading() }
        )
    }
    private _getChartAccountsCount(): Observable<void> {
        return this._chartAccountService.getAccountsCount().pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getChartAccounts(data.data.count)
            })
        )
    }
    private _getChartAccounts(count: number): Observable<void> {
        return this._chartAccountService.getAccounts(count, 0).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.chartAccounts = data.data;
                this._getAccountById()
            })
        )
    }

    private _getCurrenciesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.currenciesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getCurrencies(data.data.count)
            })
        )
    }
    private _getCurrencies(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.currenciesMainUrl, count, 0).pipe(
            map((data: ServerResponse<Currency[]>) => {
                this.currencyArray = data.data;
            })
        )
    }


    private _getAccountById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<AccountPlan>) => {

                let account = data.data
                let selectedCurrencyIds = []
                account.currencies.forEach(element => {
                    let value = {
                        id: element.id,
                        name: element.name,
                        currency: element.currency
                    }
                    this._currencyIds.push(value)
                    selectedCurrencyIds.push(value)
                });
                this.accountGroup.patchValue({
                    isAccumulatedAccount: this._appService.getBooleanVariable(account.isAccumulatedAccount),
                    account: account.account,
                    name: account.name,
                    accumulatedAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, account.acumulatedAccountId, 'account'), 0),
                    offBalanceSheet: this._appService.getBooleanVariable(account.offBalanceSheet),
                    type: this._appService.checkProperty(this._appService.filterArray(this.types, account.calculationsTypeId, 'key'), 0),
                    accountingByPartners: this._appService.getBooleanVariable(account.accountingByPartners),
                    analyticGroup1: this._appService.getBooleanVariable(account.analyticalGroup1),
                    analyticGroup2: this._appService.getBooleanVariable(account.analyticalGroup2),
                    currency: selectedCurrencyIds
                })
                this._loadingService.hideLoading()
            })
        } else {
            this._loadingService.hideLoading()
        }
    }

    public isChecked(item): boolean {
        let array = this.accountGroup.get('currency').value.filter((arr) => {
            return arr.id == item.id
        })
        return (array && array.length) ? true : false;
    }

    public addOrRemoveCurrency(item): void {
        let value = this.accountGroup.get('currency').value;
        let array = this.accountGroup.get('currency').value.filter((arr, i) => {
            return arr.id == item.id;
        })
        let index = (array && array[0]) ? value.indexOf(array[0]) : -1

        if (index > -1) {
            value.splice(index, 1)
        } else {
            value.push(item)
        }
        this.accountGroup.get('currency').setValue(value);
    }

    public close(): void {
        this._dialogRef.close()
    }

    public setValue(event, controlName): void {
        this.accountGroup.get(controlName).setValue(event);
        this.onFocus(this.accountGroup, controlName)

    }

    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.accountGroup, controlName, property)
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.accountGroup = this._fb.group({
            isAccumulatedAccount: [null],
            account: [null, Validators.required],
            name: [null, Validators.required],
            accumulatedAccount: [null],
            offBalanceSheet: [null],
            type: [null, Validators.required],
            accountingByPartners: [false],
            analyticGroup1: [false],
            analyticGroup2: [false],
            currency: [[]]
        })
        this._combineObservable()
    }
    private _setCurrencyStatus(currencyIdArray): void {
        if (this._currencyIds.length && currencyIdArray.length) {
            for (let select of this._currencyIds) {
                let element = currencyIdArray.filter((current) => {
                    return current.currencyId == select.id
                })
                let index = (element && element.length) ? currencyIdArray.indexOf(element[0]) : -1;

                if (index > -1) {
                    currencyIdArray[index]['status'] = "unChanged"
                } else {
                    currencyIdArray.push({ currencyId: select.id, status: 'deleted' })
                }
            }
            currencyIdArray.forEach((current, index) => {
                let element = this._currencyIds.filter((selected) => {
                    return selected.id == current.currencyId
                })
                if ((element && !element.length) || !element) {
                    currencyIdArray[index]['status'] = "new"
                }
            })

        } else {
            if ((!currencyIdArray || (currencyIdArray && !currencyIdArray.length)) && (this._currencyIds && this._currencyIds.length)) {
                this._currencyIds.forEach((selectedIds) => {
                    currencyIdArray.push({ currencyId: selectedIds.id, status: 'deleted' })
                })
            } else {
                if ((currencyIdArray && currencyIdArray.length) && (!this._currencyIds || (this._currencyIds && !this._currencyIds.length))) {
                    currencyIdArray.forEach((current) => {
                        current['status'] = 'new'
                    })
                }
            }
        }
    }
    public addAccount(): void {
        this._appService.markFormGroupTouched(this.accountGroup);
        if (this.accountGroup.valid) {
            this._loadingService.showLoading()
            let currencyIdArray = [];
            this.accountGroup.get('currency').value.forEach(element => {
                currencyIdArray.push({ currencyId: element.id })
            });
            if (this._data.id) {
                this._setCurrencyStatus(currencyIdArray)
            }
            let sendObject = {
                isAccumulatedAccount: this.accountGroup.get('isAccumulatedAccount').value ? true : false,
                account: this.accountGroup.get('account').value,
                name: this.accountGroup.get('name').value,
                calculationsTypeId: this.accountGroup.get('type').value.key,
                offBalanceSheet: this.accountGroup.get('offBalanceSheet').value ? true : false,
                accountingByPartners: this.accountGroup.get('accountingByPartners').value ? true : false,
                analyticalGroup_1: this.accountGroup.get('analyticGroup1').value ? true : false,
                analyticalGroup_2: this.accountGroup.get('analyticGroup2').value ? true : false,
                acumulatedAccountId: this._appService.checkProperty(this.accountGroup.get('accumulatedAccount').value, 'account'),
                currencies: currencyIdArray,
            }
            if (this._data.id) {
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            } else {
                this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })

            }
        }
    }

    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
    get error(): string {
        return this._error
    }
}
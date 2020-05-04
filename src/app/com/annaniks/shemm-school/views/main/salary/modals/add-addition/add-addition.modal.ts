import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ServerResponse, NameCodeModel, ModalDataModel, DataCount, Addition, JsonObjectType, AccountPlans } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-addition-modal',
    templateUrl: 'add-addition.modal.html',
    styleUrls: ['add-addition.modal.scss']
})
export class AddAdditionModal {
    public title: string
    private _error: string;
    public formGroup: FormGroup;
    private _subscription: Subscription
    public typeOfIncomes: NameCodeModel[] = [];
    public vacationsType: NameCodeModel[] = [];
    public calculateSalaryArray: JsonObjectType[] = []
    public accountPlans: AccountPlans[] = []
    constructor(private _dialogRef: MatDialogRef<AddAdditionModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _fb: FormBuilder, private _loadingService: LoadingService,
        private _appService: AppService, private _mainService: MainService,
        private _messageService: MessageService,

        @Inject('URL_NAMES') private _urls) { }

    ngOnInit() {
        this.title = this._data.title;
        this._validate();

    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getTypeOfIncomesCount(),
            this._mainService.getSalaryType(),
            this._mainService.getAccountsPlan(),
            this._getTypeOfVacationsCount()
        )
        this._subscription = combine.subscribe(() => {
            this.calculateSalaryArray = this._oftenUsedParamsService.getSalaryType();
            this.accountPlans = this._oftenUsedParamsService.getChartAccounts();
            this._getAdditionById()
        })
    }

    private _getTypeOfVacationsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.typeOfVacationsMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getTypeOfVacations(data.data.count)
            })
        )
    }
    private _getTypeOfVacations(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.typeOfVacationsMainUrl, count, 0).pipe(
            map((data: ServerResponse<NameCodeModel[]>) => {
                this.vacationsType = data.data
            })
        )
    }
    private _getTypeOfIncomesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.typeOfIncomesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getTypeOfIncomes(data.data.count)
            })
        )
    }
    private _getTypeOfIncomes(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.typeOfIncomesMainUrl, count, 0).pipe(
            map((data: ServerResponse<NameCodeModel[]>) => {
                this.typeOfIncomes = data.data;
            })
        )
    }

    private _getAdditionById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<Addition>) => {

                this.formGroup.patchValue({
                    name: data.data.name,
                    calculateTypeOfSalary: this._appService.checkProperty(this._appService.filterArray(this.calculateSalaryArray, +data.data.methodOfSallaryCalculation, 'id'), 0),
                    coefficient: data.data.coefficient,
                    incomeType: data.data.typeOfIncome,
                    countdown: this._appService.getBooleanVariable(data.data.recalculation),
                    isIncomeTaxWithheld: this._appService.getBooleanVariable(data.data.isIncome),
                    isDeductibleIncome: this._appService.getBooleanVariable(data.data.decliningIncome),
                    isUnionMembershipWithheld: this._appService.getBooleanVariable(data.data.isTradeUnion),
                    isOnlyForTaxCalculation: this._appService.getBooleanVariable(data.data.isForTaxPurposesOnly),
                    isWithheldMandatoryFundedPension: this._appService.getBooleanVariable(data.data.isMandatoryPension),
                    isWithheldFundedPensionIssuedByEmployer: this._appService.getBooleanVariable(data.data.byTheEmployerMandatoryPension),
                    involvedSellingPensions: data.data.typeOfVacation,
                    expenseAccount: data.data.expenseAccount,
                    isParticipatesCalculationActualHours: this._appService.getBooleanVariable(data.data.participatesOnAccountOfActualHours)
                })

                this._loadingService.hideLoading()
            })
        } else {
            this._loadingService.hideLoading()
        }
    }
    public close(): void {
        this._dialogRef.close()
    }

    private _validate(): void {
        this.formGroup = this._fb.group({
            name: [null, Validators.required],
            calculateTypeOfSalary: [null],
            coefficient: [null, Validators.required],
            incomeType: [null, Validators.required],
            countdown: [false],
            isIncomeTaxWithheld: [false],
            isDeductibleIncome: [false],
            isUnionMembershipWithheld: [false],
            isOnlyForTaxCalculation: [false],
            isWithheldMandatoryFundedPension: [false],
            isWithheldFundedPensionIssuedByEmployer: [false],
            involvedSellingPensions: [null, Validators.required],
            expenseAccount: [null],
            isParticipatesCalculationActualHours: [false]
        })
        this._combineObservable()
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public addAddition(): void {
        this._appService.markFormGroupTouched(this.formGroup)

        if (this.formGroup.valid) {
            this._loadingService.showLoading()
            let sendObject = {
                name: this.formGroup.get('name').value,
                tabel_id: null,
                methodOfSallaryCalculation: this._appService.checkProperty(this.formGroup.get('calculateTypeOfSalary').value, 'id') ? (this._appService.checkProperty(this.formGroup.get('calculateTypeOfSalary').value, 'id').toString()) : null,
                type_of_income_id: this._appService.checkProperty(this.formGroup.get('incomeType').value, 'id'),
                type_of_vacation_id: this._appService.checkProperty(this.formGroup.get('involvedSellingPensions').value, 'id'),
                expense_account_id: this._appService.checkProperty(this.formGroup.get('expenseAccount').value, 'id'),
                coefficient: this.formGroup.get('coefficient').value,
                recalculation: this.formGroup.get('countdown').value,
                is_income: this.formGroup.get('isIncomeTaxWithheld').value,
                declining_income: this.formGroup.get('isDeductibleIncome').value,
                is_trade_union: this.formGroup.get('isUnionMembershipWithheld').value,
                is_for_tax_purposes_only: this.formGroup.get('isOnlyForTaxCalculation').value,
                is_mandatory_pension: this.formGroup.get('isWithheldMandatoryFundedPension').value,
                by_the_employer_mandatory_pension: this.formGroup.get('isWithheldFundedPensionIssuedByEmployer').value,
                participates_on_account_of_actual_hours: this.formGroup.get('isParticipatesCalculationActualHours').value
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
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObject)
                    .subscribe(() => {
                        this._dialogRef.close({ value: true, id: this._data.id })
                        this._loadingService.hideLoading()
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
            }
        }

    }

    public setValue(event, controlName: string, form: FormGroup = this.formGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }
    public setInputValue(controlName: string, property: string, form = this.formGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public setModalParams(title: string, key: string, codeTitle: string = 'Կոդ') {
        let modalParams = { tabs: [codeTitle, 'Անվանում'], title: title, keys: [key, 'name'] }
        return modalParams
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
    get error(): string {
        return this._error
    }

}
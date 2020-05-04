import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';
import { MainService } from '../../../views/main/main.service';
import { LoadingService, OftenUsedParamsService, AppService } from '../../../services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-provision-salary',
  templateUrl: './provision-salary.component.html',
  styleUrls: ['./provision-salary.component.scss']
})
export class ProvisionSalaryComponent implements OnInit {
  @Input('title') public tabTitle: string;
  public title = '';
  public provisionsGroup: FormGroup;
  private _subscription: Subscription;
  public chartAccounts = [];
  public provisions = [];
  private _error;

  constructor(private _dialogRef: MatDialogRef<AddProvisionsModal>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    @Inject('URL_NAMES') private _urls) {
    this.title = this._data.title
  }

  ngOnInit() {
    this._validate()
  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
    )
    this._subscription = combine.subscribe((data) => {
      this.chartAccounts = this._oftenUsedParams.getChartAccounts();
      this._loadingService.hideLoading()
    })
  }

  private _validate() {
    
    this.provisionsGroup = this._fb.group({
      billingDate: [this._data.provisions.billingDate ? new Date(this._data.provisions.billingDate) : this.setTodayDate(), Validators.required],
      calculateWorkOrderImmediately: [this._data.provisions.calculateWorkOrderImmediately, Validators.required],
      degreeOfRounding: [this._data.provisions.degreeOfRounding, Validators.required],
      transitAccount: [this._data.provisions.transitAccount, Validators.required],
      minSalary: [this._data.provisions.minSalary, Validators.required],
      minSalaryWithPension: [this._data.provisions.minSalaryWithPension, Validators.required],
      minSalaryWithPensionStarted: [this._data.provisions.minSalaryWithPensionStarted, Validators.required],
      averageDailyCoefficientVacation: [this._data.provisions.averageDailyCoefficientVacation, Validators.required],
      averageNumberOfMonths: [this._data.provisions.averageNumberOfMonths, Validators.required],
      averageDailyCoefficientBenefit: [this._data.provisions.averageDailyCoefficientBenefit, Validators.required],
      averageDailyCoefficientMaternityBenefit: [this._data.provisions.averageDailyCoefficientMaternityBenefit, Validators.required],
      amountOfStampPayment: [this._data.provisions.amountOfStampPayment, Validators.required],
      partnerAmountOfStampPayment: [this._data.provisions.partnerAmountOfStampPayment, Validators.required],
      dateOfIntroduction: [new Date(this._data.provisions.dateOfIntroduction), Validators.required],
      accountingOfPersonnelDocuments: [this._data.provisions.accountingOfPersonnelDocuments, Validators.required],
      taxfee: [this._data.provisions.taxfee, Validators.required],
      socialTaxfee: [this._data.provisions.socialTaxfee, Validators.required]

    })
    this._combineObservable();
  }

  public addProvisions(): void {
    const { billingDate,
      calculateWorkOrderImmediately,
      degreeOfRounding,
      transitAccount,
      minSalary,
      minSalaryWithPension,
      minSalaryWithPensionStarted,
      averageDailyCoefficientVacation,
      averageNumberOfMonths,
      averageDailyCoefficientBenefit,
      averageDailyCoefficientMaternityBenefit,
      amountOfStampPayment,
      partnerAmountOfStampPayment,
      dateOfIntroduction,
      accountingOfPersonnelDocuments,
      taxfee,
      socialTaxfee
     } = this.provisionsGroup.value;
    let sendingData = {
      billingDate: this._datePipe.transform(this.provisionsGroup.get('billingDate').value, 'yyyy-MM-dd'),
      calculateWorkOrderImmediately,
      degreeOfRounding,
      transitAccount,
      minSalary,
      minSalaryWithPension,
      minSalaryWithPensionStarted,
      averageDailyCoefficientVacation,
      averageNumberOfMonths,
      averageDailyCoefficientBenefit,
      averageDailyCoefficientMaternityBenefit,
      amountOfStampPayment,
      partnerAmountOfStampPayment,
      dateOfIntroduction: this._datePipe.transform(this.provisionsGroup.get('dateOfIntroduction').value, 'yyyy-MM-dd'),
      accountingOfPersonnelDocuments,
      taxfee,
      socialTaxfee
    }
    if (this.provisionsGroup.valid) {
      this._mainService.updateJsonByUrl(this._urls.provisionSalaryUrl, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => { this._error = error.error.data[0].message; }
        )
    }

  }
  public close(): void {
    this._dialogRef.close()
  }

  public setValue(event, controlName: string): void {
    this.provisionsGroup.get(controlName).setValue(event);
  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.provisionsGroup, controlName, property)
  }
  public setModalParams(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  public setTodayDate(): Date {
    let today = new Date();
    return today
  }

  get error(): string {
    return this._error
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }
  
}

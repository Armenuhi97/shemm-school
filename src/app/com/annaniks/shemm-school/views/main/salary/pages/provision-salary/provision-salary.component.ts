import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provision-salary',
  templateUrl: './provision-salary.component.html',
  styleUrls: ['./provision-salary.component.scss']
})
export class ProvisionSalaryComponent implements OnInit {
  public tabTitle: string = 'Աշխատավարձ';
  public title = '';
  public provisionsGroup: FormGroup;
  private _subscription: Subscription;
  public chartAccounts = [];
  public provisionSalary;
  private _error;
  _count: number;

  constructor(
    // @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    private _router: Router,
    private _messageService: MessageService,
    @Inject('URL_NAMES') private _urls) {

  }


  ngOnInit() {
    this._validate();

  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getProvisions(),
      this._mainService.getAccountsPlan(),
    )
    this._subscription = combine.subscribe((data) => {
      this.chartAccounts = this._oftenUsedParams.getChartAccounts();
      this.provisionSalary = this._oftenUsedParams.getProvisions();
      this._checkMatdialogDate()

      this._loadingService.hideLoading()
    })
  }

  private _checkMatdialogDate(): void {
    if (this.provisionSalary) {
      const {
        billingDate,
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
        socialTaxfee } = this.provisionSalary;
      // let transitAccountObj = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionsGroup.get('transitAccount').value.account, 'account'), 0);
      // let partnerAmountOfStampPaymentObj = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionsGroup.get('partnerAmountOfStampPayment').value.account, 'account'), 0);

      //let transitAccountObj = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionsGroup.get('transitAccount').value.account, 'account'), 0);
      //let partnerAmountOfStampPaymentObj = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionsGroup.get('partnerAmountOfStampPayment').value.account, 'account'), 0);


      this.provisionsGroup.patchValue({
        billingDate: new Date(billingDate),
        calculateWorkOrderImmediately,
        degreeOfRounding,
        transitAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, transitAccount, 'id'), 0),
        minSalary,
        minSalaryWithPension,
        minSalaryWithPensionStarted,
        averageDailyCoefficientVacation,
        averageNumberOfMonths,
        averageDailyCoefficientBenefit,
        averageDailyCoefficientMaternityBenefit,
        amountOfStampPayment,
        partnerAmountOfStampPayment: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, partnerAmountOfStampPayment, 'id'), 0),
        dateOfIntroduction: new Date(dateOfIntroduction),
        accountingOfPersonnelDocuments,
        taxfee,
        socialTaxfee
      })
    }
  }

  private _validate() {
    this.provisionsGroup = this._fb.group({
      billingDate: [this.setTodayDate(), Validators.required],
      calculateWorkOrderImmediately: [null, Validators.required],
      degreeOfRounding: [null, Validators.required],
      transitAccount: [null, Validators.required],
      minSalary: [null, Validators.required],
      minSalaryWithPension: [null, Validators.required],
      minSalaryWithPensionStarted: [null, Validators.required],
      averageDailyCoefficientVacation: [null, Validators.required],
      averageNumberOfMonths: [null, Validators.required],
      averageDailyCoefficientBenefit: [null, Validators.required],
      averageDailyCoefficientMaternityBenefit: [null, Validators.required],
      amountOfStampPayment: [null, Validators.required],
      partnerAmountOfStampPayment: [null, Validators.required],
      dateOfIntroduction: [this.setTodayDate(), Validators.required],
      accountingOfPersonnelDocuments: [null, Validators.required],
      taxfee: [null, Validators.required],
      socialTaxfee: [null, Validators.required]
    })
    this._combineObservable();
  }

  public addProvisions(): void {
    let sendingData = {
      billingDate: this._datePipe.transform(this.provisionsGroup.get('billingDate').value, 'yyyy-MM-dd'),
      calculateWorkOrderImmediately: this.provisionsGroup.get('calculateWorkOrderImmediately').value,
      degreeOfRounding: this.provisionsGroup.get('degreeOfRounding').value,
      transitAccount: this.provisionsGroup.get('transitAccount').value.id,
      minSalary: this.provisionsGroup.get('minSalary').value,
      minSalaryWithPension: this.provisionsGroup.get('minSalaryWithPension').value,
      minSalaryWithPensionStarted: this.provisionsGroup.get('minSalaryWithPensionStarted').value,
      averageDailyCoefficientVacation: this.provisionsGroup.get('averageDailyCoefficientVacation').value,
      averageNumberOfMonths: this.provisionsGroup.get('averageNumberOfMonths').value,
      averageDailyCoefficientBenefit: this.provisionsGroup.get('averageDailyCoefficientBenefit').value,
      averageDailyCoefficientMaternityBenefit: this.provisionsGroup.get('averageDailyCoefficientMaternityBenefit').value,
      amountOfStampPayment: this.provisionsGroup.get('amountOfStampPayment').value,
      partnerAmountOfStampPayment: this.provisionsGroup.get('partnerAmountOfStampPayment').value.id,
      dateOfIntroduction: this._datePipe.transform(this.provisionsGroup.get('dateOfIntroduction').value, 'yyyy-MM-dd'),
      accountingOfPersonnelDocuments: this.provisionsGroup.get('accountingOfPersonnelDocuments').value,
      taxfee: this.provisionsGroup.get('taxfee').value,
      socialTaxfee: this.provisionsGroup.get('socialTaxfee').value
    }
    if (this.provisionsGroup.valid) {
      this._loadingService.showLoading()
      this._mainService.updateJsonByUrl(this._urls.provisionsUrl, sendingData)
        .subscribe(
          () => {
            this._messageService.add({ severity: 'success', summary: '', detail: 'Ձեր գործողությունները հաջողությամբ կատարված են' });
            this._loadingService.hideLoading()
          },
          (error) => { this._error = error.error.data[0].message;
            this._mainService.translateServerError(error);
            this._loadingService.hideLoading()
          }
        )
    }
  }
  public goBack(): void {
    this._router.navigate(['/salary'])
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

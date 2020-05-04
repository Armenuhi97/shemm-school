import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { AddProvisionsModal } from '../../../salary/modals';
import { LoadingService, OftenUsedParamsService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provision-accounts',
  templateUrl: './provision-accounts.view.html',
  styleUrls: ['./provision-accounts.view.scss']
})
export class ProvisionAccountsView implements OnInit {
  @Input('title') public tabTitle: string;

  public formGroup: FormGroup;
  private _subscription: Subscription;
  private _subscription1: Subscription;

  public chartAccounts = [];
  public title: string;
  public warehouseProvisionsGroup: FormGroup;
  public warehouseProvisions;
  constructor(
    private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _appService: AppService,
    private _router: Router,
    @Inject('URL_NAMES') private _urls
  ) {
  }

  public back() {
    this._router.navigate(['warehouse'])
}

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
    )
    this._subscription = combine.subscribe((data) => {
      this.chartAccounts = this._oftenUsedParams.getChartAccounts();
      this.patch()
      this._loadingService.hideLoading()
    })
  }


  private _validate() {
    this.formGroup = this._fb.group({});
    this.provisionAccounts.forEach((data) => {
      this.formGroup.addControl(data.formGroupName, this._fb.group({}));
      let group = this.formGroup.get(data.formGroupName) as FormGroup
      data.items.forEach((item) => {
        // group.addControl(item.formControl, this._fb.control(null))
        group.addControl(item.formControl,
          this._fb.control(this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, '0411', 'id'), 0)))
      })
      this._combineObservable()

    })
    console.log(this.formGroup.value);
  }

  private _validate1() {
    this.warehouseProvisionsGroup = this._fb.group({
      accountAAH: [null, Validators.required],
      aahPercent: [null, Validators.required],
      aahNeraryalPercent: [null, Validators.required]
    })
    this._combineObservable1();

  }

  private _combineObservable1(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
      this._mainService.getInformationByType(this._urls.warehouseGeneralUrl)
    )
    this._subscription1 = combine.subscribe((data) => {
      if (data) {
        this.chartAccounts = this._oftenUsedParams.getChartAccounts();
        this.warehouseProvisions = data[1].data;
        this._checkMatDialogData()
      }
      this._loadingService.hideLoading()

    })
  }

  private getValues() {
    // this.formGroup = this._fb.group({});
    Object.keys(this.provisionAccountData).forEach(name => {
      if (this.provisionAccountData[name]) {
        const keyss = this.provisionAccountData[name]
        for (const key in keyss) {
          if (keyss.hasOwnProperty(key)) {
            const element = keyss[key];
            console.log(element);
          }
        }
      }
    })
  }

  private patch() {
    this.getValues()
    if (this.provisionAccountData) {
      this.formGroup.patchValue({
        achievements: {
          creditDebtsAccountForServices: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['creditDebtsAccountForServices'], 'account'), 0),
          madePrepaymentsAccountForServices: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['madePrepaymentsAccountForServices'], 'account'), 0),
          creditDebtsAccountForNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['creditDebtsAccountForNA'], 'account'), 0),
          madePrepaymentsAccountForNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['madePrepaymentsAccountForNA'], 'account'), 0),
          debitAccountOfAAH: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['debitAccountOfAAH'], 'account'), 0),
          debitAccountOfAAHForImporting: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['debitAccountOfAAHForImporting'], 'account'), 0),
          creditAccountOfAAHForImporting: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['creditAccountOfAAHForImporting'], 'account'), 0),
          incomeTaxCreditAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['incomeTaxCreditAccount'], 'account'), 0),
          customsFeeAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['customsFeeAccount'], 'account'), 0),
          customsDutyAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['customsDutyAccount'], 'account'), 0),
          customsValueAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['achievements']['customsValueAccount'], 'account'), 0)
        },
        sales: {
          debitDebtsAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['debitDebtsAccount'], 'account'), 0),
          receivedPrepaymentAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['receivedPrepaymentAccount'], 'account'), 0),
          salesRevenueAccountOfNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['salesRevenueAccountOfNA'], 'account'), 0),
          salesExpenseAccountOfNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['salesExpenseAccountOfNA'], 'account'), 0),
          salesFromMainFundsIncomeAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['salesFromMainFundsIncomeAccount'], 'account'), 0),
          retailRevenueAccountOfNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['retailRevenueAccountOfNA'], 'account'), 0),
          debitDebtAccountOfRetailSale: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['debitDebtAccountOfRetailSale'], 'account'), 0),
          creditAccountOfAAH: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['creditAccountOfAAH'], 'account'), 0),
          adjustmentOfReturnEarningsFromNASale: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['adjustmentOfReturnEarningsFromNASale'], 'account'), 0),
          creditAccountOfEnvironmentalTax: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['creditAccountOfEnvironmentalTax'], 'account'), 0),
          debitAccountOfEnvironmentalTax: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['debitAccountOfEnvironmentalTax'], 'account'), 0),
          expenseAccountOfNegativeAAH: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['expenseAccountOfNegativeAAH'], 'account'), 0),
          creditAccountOfNegativeAAH: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['sales']['creditAccountOfNegativeAAH'], 'account'), 0)
        },
        warehouseAA: {
          deviationAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['warehouseAA']['deviationAccount'], 'account'), 0),
          revaluationAccountOfNA: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['warehouseAA']['revaluationAccountOfNA'], 'account'), 0),
          inExploitationPreciousHMAndAAAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this.provisionAccountData['warehouseAA']['inExploitationPreciousHMAndAAAccount'], 'account'), 0)
        }
        // this.provisionAccounts.forEach((data) => {
        //   // let fFormArray = this.formGroup.get(data.formGroupName) as FormArray

        //   this.formGroup.addControl(data.formGroupName, this._fb.group({}));
        //   let group = this.formGroup.get(data.formGroupName) as FormGroup;
        //   data.items.forEach((item) => {
        //     if (data.formGroupName) {
        //       // console.log(this.formGroup.get(data.formGroupName)[item.formControl].id);
        //       //  console.log(this.provisionAccountData);
        //       let id = (this.formGroup.get(data.formGroupName)[item.formControl] !=null ? this.formGroup.get[data.formGroupName][item.formControl].value.id: 8740);
        //       console.log(id);

        //       group.addControl(item.formControl,
        //         this._fb.control(this._appService.checkProperty(
        //           this._appService.filterArray(this.chartAccounts, id, 'id'), 0)));
        //     }
        //     // console.log(group);

        //   })

      })

    }
  }



  public provisionAccountData;

  ngOnInit() {
    this._validate();
    this._validate1();
    this._mainService.getInformationByType(this._urls.provisionAccountUrl).subscribe(data => {
      this.provisionAccountData = data.data;
    })

  }

  public addProvisionAccount() {
    let sendingData = {
      achievements: {
        creditDebtsAccountForServices: this.formGroup.get('achievements').get('creditDebtsAccountForServices').value.account,
        madePrepaymentsAccountForServices: this.formGroup.get('achievements').get('madePrepaymentsAccountForServices').value.account,
        creditDebtsAccountForNA: this.formGroup.get('achievements').get('creditDebtsAccountForNA').value.account,
        madePrepaymentsAccountForNA: this.formGroup.get('achievements').get('madePrepaymentsAccountForNA').value.account,
        debitAccountOfAAH: this.formGroup.get('achievements').get('debitAccountOfAAH').value.account,
        debitAccountOfAAHForImporting: this.formGroup.get('achievements').get('debitAccountOfAAHForImporting').value.account,
        creditAccountOfAAHForImporting: this.formGroup.get('achievements').get('creditAccountOfAAHForImporting').value.account,
        incomeTaxCreditAccount: this.formGroup.get('achievements').get('incomeTaxCreditAccount').value.account,
        customsFeeAccount: this.formGroup.get('achievements').get('customsFeeAccount').value.account,
        customsDutyAccount: this.formGroup.get('achievements').get('customsDutyAccount').value.account,
        customsValueAccount: this.formGroup.get('achievements').get('customsValueAccount').value.account,
      },
      sales: {
        debitDebtsAccount: this.formGroup.get('sales').get('debitDebtsAccount').value.account,
        receivedPrepaymentAccount: this.formGroup.get('sales').get('receivedPrepaymentAccount').value.account,
        salesRevenueAccountOfNA: this.formGroup.get('sales').get('salesRevenueAccountOfNA').value.account,
        salesExpenseAccountOfNA: this.formGroup.get('sales').get('salesExpenseAccountOfNA').value.account,
        salesFromMainFundsIncomeAccount: this.formGroup.get('sales').get('salesFromMainFundsIncomeAccount').value.account,
        retailRevenueAccountOfNA: this.formGroup.get('sales').get('retailRevenueAccountOfNA').value.account,
        debitDebtAccountOfRetailSale: this.formGroup.get('sales').get('debitDebtAccountOfRetailSale').value.account,
        creditAccountOfAAH: this.formGroup.get('sales').get('creditAccountOfAAH').value.account,
        adjustmentOfReturnEarningsFromNASale: this.formGroup.get('sales').get('adjustmentOfReturnEarningsFromNASale').value.account,
        creditAccountOfEnvironmentalTax: this.formGroup.get('sales').get('creditAccountOfEnvironmentalTax').value.account,
        debitAccountOfEnvironmentalTax: this.formGroup.get('sales').get('debitAccountOfEnvironmentalTax').value.account,
        expenseAccountOfNegativeAAH: this.formGroup.get('sales').get('expenseAccountOfNegativeAAH').value.account,
        creditAccountOfNegativeAAH: this.formGroup.get('sales').get('creditAccountOfNegativeAAH').value.account
      },
      warehouseAA: {
        deviationAccount: this.formGroup.get('warehouseAA').get('deviationAccount').value.account,
        revaluationAccountOfNA: this.formGroup.get('warehouseAA').get('revaluationAccountOfNA').value.account,
        inExploitationPreciousHMAndAAAccount: this.formGroup.get('warehouseAA').get('inExploitationPreciousHMAndAAAccount').value.account
      }
    }
    this.formGroup.get('achievements').markAllAsTouched();
    this.formGroup.get('sales').markAllAsTouched();
    this.formGroup.get('warehouseAA').markAllAsTouched()
    console.log(sendingData);

    return this._mainService.updateJsonByUrl(this._urls.provisionAccountUrl, sendingData)
      .subscribe(data => {
        console.log('from server', data)
      })
  }
  public provisionAccounts = [
    // {
    //   title: 'Խումբ։ 01 Բանկ',
    //   isOpen: false,
    //   formGroupName: 'bank',
    //   items: [
    //     { label: 'Հաշվարկային հաշիվ', formControl: 'billingAccount' },
    //     { label: 'Ինտերնետ բանկից ներմուծված կրեդիտային հաշիվ', formControl: 'importCreditAccountFromInternetBank' },
    //     { label: 'Ինտերնետ բանկից ներմուծված դեբետային հաշիվ', formControl: 'importDebitAccountFromInternetBank' },
    //     { label: 'Անկանխիկ գործաչքների հաշիվ', formControl: 'nonCashTransactionsAccount' }
    //   ]
    // },
    // {
    //   title: 'Խումբ։ 02 Արտարժութային հաշվառում',
    //   isOpen: false,
    //   formGroupName: 'foreignCurrencyAccounting',
    //   items: [
    //     { label: 'Վերագնահատւմից օգուտներ', formControl: 'benefitsFromRevaluation' },
    //     { label: 'Վերագնահատւմից վնասներ', formControl: 'damagesFromRevaluation' },
    //     { label: 'Արտարժույթի փոխանակման տարանցիկ հաշիվ', formControl: 'currencyConversionTransitAccount' },
    //     { label: 'Արտարժույթի փոխանակման տարանցիկ օգուտներ', formControl: 'benefitsFromCurrencyConversion' },
    //     { label: 'Արտարժույթի փոխանակման տարանցիկ վնասներ', formControl: 'damagesFromCurrencyConversion' }
    //   ]
    // },
    {
      title: 'Խումբ։ 01 Ձեռքբերումներ',
      isOpen: false,
      formGroupName: 'achievements',
      items: [
        { label: 'Կրեդիտորական պարտքերի հաշիվ ծառայությունների գծով', formControl: 'creditDebtsAccountForServices' },
        { label: 'Տրված կանխավճարների հաշիվ ծառայությունների գծով', formControl: 'madePrepaymentsAccountForServices' },
        { label: 'Կրեդիտորական պարտքերի հաշիվ ՆԱ-ների գծով', formControl: 'creditDebtsAccountForNA' },
        { label: 'Տրված կանխավճարների հաշիվ ՆԱ-ների գծով', formControl: 'madePrepaymentsAccountForNA' },
        { label: 'ԱԱՀ-ի դեբետային հաշիվ', formControl: 'debitAccountOfAAH' },
        { label: 'ԱԱՀ-ի դեբետային հաշիվ ներմուծման գծով', formControl: 'debitAccountOfAAHForImporting' },
        { label: 'ԱԱՀ-ի կրեդիտային հաշիվ ներմուծման գծով', formControl: 'creditAccountOfAAHForImporting' },
        { label: 'Եկամտային հարկի կրեդիտային հաշիվ', formControl: 'incomeTaxCreditAccount' },
        { label: 'Մաքսավճարի հաշիվ', formControl: 'customsFeeAccount' },
        { label: 'Մաքսատուրքի հաշիվ', formControl: 'customsDutyAccount' },
        { label: 'Մաքսային արծեքի հաշիվ', formControl: 'customsValueAccount' },
      ]
    },
    {
      title: 'Խումբ։ 02 Վաճառքներ',
      isOpen: false,
      formGroupName: 'sales',
      items: [
        { label: 'Դեբիտորական պարտքերի հաշիվ', formControl: 'debitDebtsAccount' },
        { label: 'Ստացված կանխավճարների հաշիվ', formControl: 'receivedPrepaymentAccount' },
        { label: 'ՆԱ վաճառքից հասույթի հաշիվ', formControl: 'salesRevenueAccountOfNA' },
        { label: 'ՆԱ վաճառքից ծախսի հաշիվ', formControl: 'salesExpenseAccountOfNA' },
        { label: 'ՀՄ-ների վաճառքներից եկամուտների հաշիվ', formControl: 'salesFromMainFundsIncomeAccount' },
        { label: 'ՆԱ մանրածախ վաճառքից հասույթի հաշիվ', formControl: 'retailRevenueAccountOfNA' },
        { label: 'Մանրածախ վաճառքի դեբիտորական պարտքերի հաշիվ', formControl: 'debitDebtAccountOfRetailSale' },
        { label: 'ԱԱՀ-ի կրեդիտային հաշիվ', formControl: 'creditAccountOfAAH' },
        { label: 'ՆԱ վաճառքից հետ վերադարձի հասույթի ճշգրտում', formControl: 'adjustmentOfReturnEarningsFromNASale' },
        { label: 'Բնապահպանական հարկի կրեդիտային հաշիվ', formControl: 'creditAccountOfEnvironmentalTax' },
        { label: 'Բնապահպանական հարկի դեբետային հաշիվ', formControl: 'debitAccountOfEnvironmentalTax' },
        { label: 'Բացասական ԱԱՀ—ի ծախսի հաշիվ', formControl: 'expenseAccountOfNegativeAAH' },
        { label: 'Բացասական ԱԱՀ—ի կրեդիտային հաշիվ', formControl: 'creditAccountOfNegativeAAH' }
      ]
    },
    {
      title: 'Խումբ։ 03 Պահեստ, ԱԱ-ների հաշիվ',
      isOpen: false,
      formGroupName: 'warehouseAA',
      items: [
        { label: 'Շեղման հաշիվ', formControl: 'deviationAccount' },
        { label: 'ՆԱ վերագնահատման հաշիվ', formControl: 'revaluationAccountOfNA' },
        { label: 'Շահագործ․ մեջ գտնվող փոխարժեք ՀՄ-ների և ԱԱ-ների հաշիվ', formControl: 'inExploitationPreciousHMAndAAAccount' },

      ]
    },
    // {
    //   title: 'Խումբ։ 06 Դրամարկղ',
    //   isOpen: false,
    //   formGroupName: 'cashRegister',
    //   items: [
    //     { label: 'Դրամական ներհոսքի հաշիվ', formControl: 'cashInflowAccount' },
    //     { label: 'Դրամական արտահոսքի հաշիվ', formControl: 'cashOutflowAccount' }

    //   ]
    // },
    // {
    //   title: 'Խումբ։ 07 Այլ',
    //   isOpen: false,
    //   formGroupName: 'other',
    //   items: [
    //     { label: 'Արտհաշվեկշռային հաշիվների հետ թղթ․ համար հաշիվ', formControl: 'paperAccountsWithOff_balanceSheet' },
    //     { label: 'Առհաշիվ գումարների հաշիվ', formControl: 'moneyAccount' }

    //   ]
    // }
  ];


  public accountsFormGroup(item) {
    return this.formGroup.get(item.formGroupName)
  }
  public getControlName(item): string {
    return item.formControl
  }

  public toggle(provisionAccount): void {
    provisionAccount.isOpen = !provisionAccount.isOpen
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }


  public setValue(event, controlName: string, form): void {
    form.get(controlName).setValue(event);
    this.onFocus(form, controlName)
  }


  public setValuew(event, controlName?) {
    this.warehouseProvisionsGroup.get(controlName).setValue(event);
  }

  public setInputValuew(controlName: string, property: string) {
    return this._appService.setInputValue(this.warehouseProvisionsGroup, controlName, property)
  }

  public setModalParamsw(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  public setModalParams(title: string, tabsArray: Array<string>, keys: Array<string>) {
    let modalParams = { tabs: tabsArray, title: title, keys: keys };
    return modalParams
  }


  public setInputValue(controlName: string, property: string, form) {
    return this._appService.setInputValue(form, controlName, property)
  }


  private _checkMatDialogData(): void {
    if (this.warehouseProvisions != null) {
      const { accountAAH, aahPercent, aahNeraryalPercent } = this.warehouseProvisions;
      let accountObj = this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParams.getChartAccounts(), accountAAH, 'id'), 0);
      this.warehouseProvisionsGroup.patchValue({
        accountAAH: accountObj,
        aahPercent,
        aahNeraryalPercent
      })
    }
  }



  public addWarehouseProvisions(): void {
    this._loadingService.showLoading();
    if (this.warehouseProvisionsGroup.valid) {
      let sendingDada = {
        accountAAH: this._appService.checkProperty(this.warehouseProvisionsGroup.get('accountAAH').value, 'id'),
        aahPercent: this.warehouseProvisionsGroup.get('aahPercent').value,
        aahNeraryalPercent: this.warehouseProvisionsGroup.get('aahNeraryalPercent').value
      }
      this._mainService.updateJsonByUrl(this._urls.warehouseGeneralUrl, sendingDada)
        .subscribe((data) => {
          this._loadingService.hideLoading()
        },
          (err) => {
            this._mainService.translateServerError(err);
            this._loadingService.hideLoading()
          })
    }
  }




}


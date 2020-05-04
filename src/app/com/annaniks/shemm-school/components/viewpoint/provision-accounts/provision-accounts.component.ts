
import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../../../views/main/main.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';

@Component({
  selector: 'app-provision-accounts',
  templateUrl: './provision-accounts.component.html',
  styleUrls: ['./provision-accounts.component.scss']
})
export class ProvisionAccountsComponent implements OnInit {
  @Input('title') public tabTitle: string;

  public formGroup: FormGroup;
  constructor(
    private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    @Inject('URL_NAMES') private _urls
  ) {
    this._validate()
  }


  private _validate() {
    this.formGroup = this._fb.group({});
    this.provisionAccounts.forEach((data) => {
      this.formGroup.addControl(data.formGroupName, this._fb.group({}));
      let group = this.formGroup.get(data.formGroupName) as FormGroup
      data.items.forEach((item) => {
        console.log(item);

        group.addControl(item.formControl, this._fb.control('001'))
      })
    })
    console.log(this.formGroup.value);

  }
  public close() {
    this._dialogRef.close()
  }

  public provisionAccountData
  ngOnInit() {
    this._mainService.getInformationByType(this._urls.provisionAccountUrl).subscribe(data => {
      this.provisionAccountData = data.data;
      console.log(9999, this.provisionAccountData);
   
    })

    setTimeout(() => {
      this.ss()
    }, 1000);


  
  }
  public ss() {
    if(this.provisionAccountData) {
      let arr = []
      for (var key in this.provisionAccountData) { 
        if (this.provisionAccountData.hasOwnProperty(key)) {
          arr.push(this.provisionAccountData[key])
        }
      }
      console.log(arr);
                                                                                                                                          
    }
  }

  public addProvisionAccount() {
    console.log(this.formGroup.value);

    return this._mainService.updateJsonByUrl(this._urls.provisionAccountUrl, this.formGroup.value)
      .subscribe(data => {
        console.log('from server', data)
      })
  }
  public provisionAccounts = [
    {
      title: 'Խումբ։ 01 Բանկ',
      isOpen: false,
      formGroupName: 'bank',
      items: [
        { label: 'Հաշվարկային հաշիվ', formControl: 'billingAccount' },
        { label: 'Ինտերնետ բանկից ներմուծված կրեդիտային հաշիվ', formControl: 'importCreditAccountFromInternetBank' },
        { label: 'Ինտերնետ բանկից ներմուծված դեբետային հաշիվ', formControl: 'importDebitAccountFromInternetBank' },
        { label: 'Անկանխիկ գործաչքների հաշիվ', formControl: 'nonCashTransactionsAccount' }
      ]
    },
    {
      title: 'Խումբ։ 02 Արտարժութային հաշվառում',
      isOpen: false,
      formGroupName: 'foreignCurrencyAccounting',
      items: [
        { label: 'Վերագնահատւմից օգուտներ', formControl: 'benefitsFromRevaluation' },
        { label: 'Վերագնահատւմից վնասներ', formControl: 'damagesFromRevaluation' },
        { label: 'Արտարժույթի փոխանակման տարանցիկ հաշիվ', formControl: 'currencyConversionTransitAccount' },
        { label: 'Արտարժույթի փոխանակման տարանցիկ օգուտներ', formControl: 'benefitsFromCurrencyConversion' },
        { label: 'Արտարժույթի փոխանակման տարանցիկ վնասներ', formControl: 'damagesFromCurrencyConversion' }
      ]
    },
    {
      title: 'Խումբ։ 03 Ձեռքբերումներ',
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
      title: 'Խումբ։ 04 Վաճառքներ',
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
      title: 'Խումբ։ 05 Պահեստ, ԱԱ-ների հաշիվ',
      isOpen: false,
      formGroupName: 'warehouseAA',
      items: [
        { label: 'Շեղման հաշիվ', formControl: 'deviationAccount' },
        { label: 'ՆԱ վերագնահատման հաշիվ', formControl: 'revaluationAccountOfNA' },
        { label: 'Շահագործ․ մեջ գտնվող փոխարժեք ՀՄ-ների և ԱԱ-ների հաշիվ', formControl: 'inExploitationPreciousHMAndAAAccount' },

      ]
    },
    {
      title: 'Խումբ։ 06 Դրամարկղ',
      isOpen: false,
      formGroupName: 'cashRegister',
      items: [
        { label: 'Դրամական ներհոսքի հաշիվ', formControl: 'cashInflowAccount' },
        { label: 'Դրամական արտահոսքի հաշիվ', formControl: 'cashOutflowAccount' }

      ]
    },
    {
      title: 'Խումբ։ 07 Այլ',
      isOpen: false,
      formGroupName: 'other',
      items: [
        { label: 'Արտհաշվեկշռային հաշիվների հետ թղթ․ համար հաշիվ', formControl: 'paperAccountsWithOff_balanceSheet' },
        { label: 'Առհաշիվ գումարների հաշիվ', formControl: 'moneyAccount' }

      ]
    }
  ];


  public accountsFormGroup(item) {
    return this.formGroup.get(item.formGroupName)
  }
  public getControlName(item): string {
    return item.formControl
  }

  public toggle(provisionAccount) {
    provisionAccount.isOpen = !provisionAccount.isOpen
  }


}


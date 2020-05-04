import { Component, Injectable, OnInit, Input, Inject } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MainService } from '../../../views/main/main.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';

@Component({
  selector: 'app-provision-document-numbers',
  templateUrl: './provision-document-numbers.component.html',
  styleUrls: ['./provision-document-numbers.component.scss']
})
export class ProvisionDocumentNumbersComponent implements OnInit {
  @Input('title') public tabTitle: string;
  public formGroup: FormGroup;
  constructor(private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    @Inject('URL_NAMES') private _urls
  ) {
    this._validate()
  }


  private _validate() {
    this.formGroup = this._fb.group({});
    this.provisionDocumentNumbers.forEach((data) => {
      this.formGroup.addControl(data.formGroupName, this._fb.group({}));
      let group = this.formGroup.get(data.formGroupName) as FormGroup
      data.items.forEach((item) => {
        group.addControl(item.formControl, this._fb.control(null))
      })
    })
  }

  ngOnInit() {

  }

  public addProvisionDocumentNumber() {
    return this._mainService.updateJsonByUrl(this._urls.provisionDocumentNumbersUrl, this.formGroup.value)
      .subscribe(data=>{
        console.log('from server',data)
      })
  }

  public provisionDocumentNumbers = [
    {
      title: 'Խումբ։ 01 Հաշվապահություն',
      isOpen: false,
      formGroupName: 'accounting',
      items: [
        { label: 'Հիշարարի օրդեր', formControl: 'memoryOrder' },
        { label: 'Ստացված ծառայություններ', formControl: 'receivedServices' },
        { label: 'Վճարման հանձնարարագիր', formControl: 'paymentOrder' },
        { label: 'Արտարժույթի փոխանակում', formControl: 'currencyConversion' },
        { label: 'Առհաշիվ գումարների ծախս', formControl: 'expenseOfMoney' },
        { label: 'Փոխադարձ հաշվարկների ստուգման ակտ', formControl: 'mutualCheckingAct' },
        { label: 'Հաշվի վերագնահատում', formControl: 'accountRevaluation' },     
        { label: 'Գործընկերոջ հաշվի վերագնահատում', formControl: 'accountRevaluationOfPartner' },
        { label: 'Հաշիվների խմբային վարագնահատում', formControl: 'groupAccountsRevaluation' }
      ]
    },
    {
      title: 'Խումբ։ 02 Պահեստ',
      isOpen: false,
      formGroupName: 'warehouse',
      items: [
        { label: 'Հաշիվ-Ապրանքագիր', formControl: 'accountInvoice' },
        { label: 'Վաճառք (Մանրածախ)', formControl: 'retailerSale' },
        { label: 'Փոխանցման հաշիվ', formControl: 'transferAccount' },
        { label: 'Վերադարձ գնորդից', formControl: 'returnFromBuyer' },
        { label: 'Վերադարձ մատակարարին', formControl: 'returnToProvider' },
        { label: 'Պահեստի մուտքի օրդեր', formControl: 'warehouseEntryOrder' },
        { label: 'ՆԱ մնացորդների մուտք', formControl: 'accessToMaterialValueBalances' },
        { label: 'Հավելյալ ծախսերի բաշխում', formControl: 'extraExpenseDistribution' },
        { label: 'ԲՄՀ(Ներմուծում) ', formControl: 'importBMH' },
        { label: 'Պատվեր մատակարարին', formControl: 'orderToProvider' },
        { label: 'Պահեստի ելքի օրդեր', formControl: 'warehouseExitOrder' },
        { label: 'Նյութական արժեքների տեղաշարժ', formControl: 'movementOfMaterialValues' },
        { label: 'Նյութական արժեքի կոմպլեկտավորում', formControl: 'complatingOfMaterialValues' },
        { label: 'Նյութական արժեքի ապակոմպլեկտավորում', formControl: 'recomplatingOfMaterialValues' },
        { label: 'Նյութական արժեքների գույքագրում', formControl: 'inventoringOfMaterialValues' },
        { label: 'Նյութական արժեքի վերագնահատում', formControl: 'revaluationOfMaterialValues' },
        { label: 'ԱԱՀ գումարների ճշտում', formControl: 'aahAdjustmentOfFunds' }
      ]
    },
    {
      title: 'Խումբ։ 03 Արագամաշ առարկաներ',
      isOpen: false,
      formGroupName: 'fastWornItems',
      items: [
        { label: 'ԱԱ-ի ձեռքբերում և շահագործման հանձնում', formControl: 'aaAchievementAndExploitation' },
        { label: 'ԱԱ-ի մնացորդների մուտք', formControl: 'accessToAABalance' },
        { label: 'ԱԱ-ի շահագործման հանձնում', formControl: 'aaExploitationTransfer' },
        { label: 'Շահագործվող ԱԱ-ների տեղաշարժ', formControl: 'movementOfExploitationAA' },
        { label: 'Շահագործվող ԱԱ-ների լուծարում', formControl: 'liquidationOfmovementOfExploitationAA' }
      ]
    },
    {
      title: 'Խումբ։ 04 Աշխատավարձ',
      isOpen: false,
      formGroupName: 'salary',
      items: [
        { label: 'Հաստատել հավելում/պահում', formControl: 'confirmAdditionHold' },
        { label: 'Ավտոհավելում/պահում', formControl: 'autoAdditionHold' },
        { label: 'Արձակուրդայինի հաշվարկ', formControl: 'vacationCalculation' },
        { label: 'Նպաստների հաշվարկ', formControl: 'benefitCalculation' },
        { label: 'Վերջնահաշվարկ', formControl: 'finalCalculation' },
        { label: 'Բացակայություններ', formControl: 'absences' },
        { label: 'Վճարումներ', formControl: 'payments' },
        { label: 'Վճարումներ հաշվարկային միջոց', formControl: 'paymentFromBillingAccount' },
        { label: 'Աշխատավարձի ջևակերպումներ', formControl: 'salaryFormulations' },
        { label: 'Ներդրման տվյալներ', formControl: 'investmentData' },
        { label: 'Ընդունման հրաման', formControl: 'acceptanceՕrder' },
        { label: 'Փոխադրման հրաման', formControl: 'shippingՕrder' },
        { label: 'Ազատման հրաման', formControl: 'releaseՕrder' },

      ]
    },
    {
      title: 'Խումբ։ 04 Հիմնական միջոցներ',
      isOpen: false,
      formGroupName: 'mainFunds',
      items: [
        { label: 'ՀՄ-ի ձեռքբերում', formControl: 'achievementHM' },
        { label: 'ՀՄ-ի ձեռքբերում և շահագործում', formControl: 'achievementAndExploitationHM' },
        { label: 'Շահագործման հանձման ակտ', formControl: 'exploitationTransferAct' },
        { label: 'Մաշվածքի հաշվարկր', formControl: 'depreciationCalculation' },
        { label: 'Ներքին տեղափոխման ակտ', formControl: 'internalTransferAct' },
        { label: 'Շահագործումից հանման ակտ', formControl: 'fromExploitationSubtractionAct' },
        { label: 'Վերաշահագործում', formControl: 'reexploitation' },
        { label: 'Վերակառուցում', formControl: 'reconstruction' },
        { label: 'Վերագնահատում', formControl: 'revaluation' },
        { label: 'Մասնակի լուծարում', formControl: 'partialDissolution' },
        { label: 'Օգտակար ծառայության ժամկետի վերանայում', formControl: 'usefulServiceTimeReview' },
        { label: 'Դուրսգրման ակտ', formControl: 'writeOffAct' },
        { label: 'ՀՄ գույքագրում', formControl: 'inventoryHM' }

      ]
    }
  ]

  public documentNumbersFormGroup(item) {
    return this.formGroup.get(item.formGroupName)
  }
  public getControlName(item): string {
    return item.formControl
  }

  public toggle(provisionDocumentNumber) {
    provisionDocumentNumber.isOpen = !provisionDocumentNumber.isOpen
  }

  public close(): void {
    this._dialogRef.close()
  }
}

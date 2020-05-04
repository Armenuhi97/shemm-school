import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MainService } from '../../../views/main/main.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddProvisionsModal } from '../../../views/main/salary/modals';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-provision-printing-templates',
  templateUrl: './provision-printing-templates.component.html',
  styleUrls: ['./provision-printing-templates.component.scss'],
  animations: [
    trigger('collapse', [
      state('small', style({ height: '0px'})),
      state('large', style({ height: '100px'})),
      transition('small<=>large', animate('2000ms ease-in'))
    ])
  ]
})
export class ProvisionPrintingTemplatesComponent implements OnInit {
  @Input('title') public tabTitle: string;
  public formGroup: FormGroup;
  public state: string
  constructor(private _dialogRef: MatDialogRef<AddProvisionsModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    @Inject('URL_NAMES') private _urls
  ) {
    this._validate()
  }


  private _validate() {
    this.formGroup = this._fb.group({});
    this.printingTemplates.forEach((data) => {
      this.formGroup.addControl(data.formGroupName, this._fb.group({}));
      let group = this.formGroup.get(data.formGroupName) as FormGroup
      data.items.forEach((item) => {
        group.addControl(item.formControl, this._fb.control(null))
      })
    })
    console.log(this.formGroup.value);

  }


  ngOnInit() {

  }

  public addProvisionPrintingTemplates() {
    console.log(this.formGroup.value);

    return this._mainService.updateJsonByUrl(this._urls.provisionPrintingTemplatesUrl, this.formGroup.value)
      .subscribe(data => {
        console.log('from server', data)
      })
  }

  public printingTemplates = [
    {
      title: 'Խումբ։ 01 Հաշվապահություն',
      isOpen: false,
      formGroupName: 'accounting',
      items: [
        { label: 'Հիշարարի օրդեր', formControl: 'memoryOrder' },
        { label: 'Ստացված ծառայություններ', formControl: 'receivedServices' },
        { label: 'Վճարման հանձնարարագիր', formControl: 'paymentOrder' },
        { label: 'Դրամարկղի մուտքի օրդեր', formControl: 'cashREgisterOrder' },
        { label: 'Դրամարկղի ելքի օրդեր', formControl: 'cashOutOrder' },
        { label: 'Փոխանցման հաշիվ', formControl: 'transferAccount' },
        { label: 'Արտարժույթի փոխանակում', formControl: 'currencyConversion' },
        { label: 'Առհաշիվ գումարների ծախս', formControl: 'expenseOfMoney' },
        { label: 'Հաշվի վերագնահատում', formControl: 'accountRevaluation' },
        { label: 'Գործընկերոջ հաշվի վերագնահատում', formControl: 'accountRevaluationOfPartner' },
        { label: 'Հաշիվների խմբային վարագնահատում', formControl: 'groupAccountsRevaluation' },
        { label: 'Փոխադարձ հաշվարկների ստուգման ակտ', formControl: 'mutualCheckingAct' },
        { label: 'Պատվեր մատակարարին', formControl: 'orderToProvider' },
        { label: 'Ընդունման հրաման', formControl: 'acceptanceCommand' },
        { label: 'Փոխադրման հրաման', formControl: 'transportationCommand' },
        { label: 'Ազատման հրաման', formControl: 'releaseCommand' }
      ]
    },
    {
      title: 'Խումբ։ 02 Պահեստ',
      isOpen: false,
      formGroupName: 'warehouse',
      items: [
        { label: 'Հաշիվ-Ապրանքագիր', formControl: 'accountInvoice' },
        { label: 'Վաճառք (Մանրածախ)', formControl: 'retailerSale' },
        { label: 'Վերադարձ գնորդից', formControl: 'returnFromBuyer' },
        { label: 'Վերադարձ մատակարարին', formControl: 'returnToProvider' },
        { label: 'Պահեստի մուտքի օրդեր', formControl: 'warehouseEntryOrder' },
        { label: 'Հավելյալ ծախսերի բաշխում', formControl: 'extraExpenseDistribution' },
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
        { label: 'Արձակուրդայինի հաշվարկ', formControl: 'employees' },
        { label: 'Նպաստների հաշվարկ', formControl: 'subdivision' },
        { label: 'Վերջնահաշվարկ', formControl: 'position' },
        { label: 'Վճարումներ', formControl: 'profession' }
      ]
    },
    {
      title: 'Խումբ։ 05 Հիմնական միջոցներ',
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

  public templatesFormGroup(item) {
    return this.formGroup.get(item.formGroupName)
  }
  public getControlName(item): string {
    return item.formControl
  }

  public openOrClose(printingTemplate) {
    console.log(printingTemplate.isOpen)
    printingTemplate.isOpen = !printingTemplate.isOpen;
    this.state = (printingTemplate.isOpen == true) ? 'small' : 'large'
  }

  public close(): void {
    this._dialogRef.close()
  }


}
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MainService } from '../../../views/main/main.service';
import { LoadingService, AppService, OftenUsedParamsService } from '../../../services';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-provisions-common',
  templateUrl: './provisions-common.component.html',
  styleUrls: ['./provisions-common.component.scss']
})
export class ProvisionsCommonComponent implements OnInit {
  @Input('title') public tabTitle: string;

  public provisionCommonGroup: FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    @Inject('URL_NAMES') private _urls
     ) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.provisionCommonGroup.patchValue({
        workingPeriodFrom: new Date(this.provisionValue.workingPeriodFrom),
        workingPeriodTo:new Date(this.provisionValue.workingPeriodTo),
        workingLanguage: this.provisionValue.workingLanguage,
        aah: this.provisionValue.aah,
        aahIncluding: this.provisionValue.aahIncluding,
        environmentalTaxpayer: this.provisionValue.environmentalTaxpayer,
        demandConfirmWindowClosing: this.provisionValue.demandConfirmWindowClosing,
        bringReportsElectronicTableFormat: this.provisionValue.bringReportsElectronicTableFormat,
        advancedMethodOfFilteringDateTypeColumns: this.provisionValue.advancedMethodOfFilteringDateTypeColumns,
        ignoreZeroSumTransactions: this.provisionValue.ignoreZeroSumTransactions,
        transactionAccountAndPartnerFiltration: this.provisionValue.transactionAccountAndPartnerFiltration,
        checkAccountCorrespondence: this.provisionValue.checkAccountCorrespondence,
        checkComplianceOfSubaccountAndAccumulatorAccounts: this.provisionValue.checkComplianceOfSubaccountAndAccumulatorAccounts,
        saveEditedOperationsCopyingDocument: this.provisionValue.saveEditedOperationsCopyingDocument,
        inAccountFieldsNotLimitSelectionOfPartnerAccounts: this.provisionValue.inAccountFieldsNotLimitSelectionOfPartnerAccounts,
        allowToUseDiscountWhenSelling: this.provisionValue.allowToUseDiscountWhenSelling,
        allowDiscountsWhenPurchasing: this.provisionValue.allowDiscountsWhenPurchasing,
        exportHCIdentifier: this.provisionValue.exportHCIdentifier,
        groupReRegistrationOfDocuments: this.provisionValue.groupReRegistrationOfDocuments,
        showPartnerHVHHinLogsAndReports: this.provisionValue.showPartnerHVHHinLogsAndReports,
        importRatesOfKBWhenLogInToSystem: this.provisionValue.importRatesOfKBWhenLogInToSystem,
        participateCustomerExperienceImprovementProgram: this.provisionValue.participateCustomerExperienceImprovementProgram,
        analiticGroups: {
          countOfAnaliticGroups: true,
          keepAnalyticsFieldsUnderEachOther: false
        }
      })
    }, 500);
    this._validate();
    this.getProvisionValue()

  }
  private _validate() {
    this.provisionCommonGroup = this._fb.group({
      workingPeriodFrom: [null, Validators.required],
      workingPeriodTo: [null, Validators.required],
      workingLanguage: [null, Validators.required],
      aah: [20, Validators.required],
      aahIncluding: [null, Validators.required],
      environmentalTaxpayer: [false, Validators.required],
      demandConfirmWindowClosing: [true, Validators.required],
      bringReportsElectronicTableFormat: [false, Validators.required],
      advancedMethodOfFilteringDateTypeColumns: [true, Validators.required],
      ignoreZeroSumTransactions: [false, Validators.required],
      transactionAccountAndPartnerFiltration: [false, Validators.required],
      checkAccountCorrespondence: [false, Validators.required],
      checkComplianceOfSubaccountAndAccumulatorAccounts: [false],
      saveEditedOperationsCopyingDocument: [true],
      inAccountFieldsNotLimitSelectionOfPartnerAccounts: [false],
      allowToUseDiscountWhenSelling: [false],
      allowDiscountsWhenPurchasing: [false],
      exportHCIdentifier: [false],
      groupReRegistrationOfDocuments: [true],
      showPartnerHVHHinLogsAndReports: [false],
      importRatesOfKBWhenLogInToSystem: [true],
      participateCustomerExperienceImprovementProgram: [true],
      analiticGroups: this._fb.group({
        countOfAnaliticGroups: true,
          keepAnalyticsFieldsUnderEachOther: false
      })
    })
  }

  public addProvisionCommon() {
    let sendinDate =  {
      workingPeriodFrom: this.provisionCommonGroup.get('workingPeriodFrom').value? this._datePipe.transform(new Date(this.provisionCommonGroup.get('workingPeriodFrom').value), 'yyyy-MM-dd'): this.setTodayDate(),
      workingPeriodTo:this.provisionCommonGroup.get('workingPeriodTo').value?  this._datePipe.transform(new Date(this.provisionCommonGroup.get('workingPeriodTo').value), 'yyyy-MM-dd') : this.setTodayDate(),
      workingLanguage: this.provisionCommonGroup.get('workingLanguage').value,
      aah: this.provisionCommonGroup.get('aah').value,
      aahIncluding: this.provisionCommonGroup.get('aahIncluding').value,
      environmentalTaxpayer: this.provisionCommonGroup.get('environmentalTaxpayer').value,
      demandConfirmWindowClosing: this.provisionCommonGroup.get('demandConfirmWindowClosing').value,
      bringReportsElectronicTableFormat: this.provisionCommonGroup.get('bringReportsElectronicTableFormat').value,
      advancedMethodOfFilteringDateTypeColumns: this.provisionCommonGroup.get('advancedMethodOfFilteringDateTypeColumns').value,
      ignoreZeroSumTransactions: this.provisionCommonGroup.get('ignoreZeroSumTransactions').value,
      transactionAccountAndPartnerFiltration: this.provisionCommonGroup.get('transactionAccountAndPartnerFiltration').value,
      checkAccountCorrespondence: this.provisionCommonGroup.get('checkAccountCorrespondence').value,
      checkComplianceOfSubaccountAndAccumulatorAccounts: this.provisionCommonGroup.get('checkComplianceOfSubaccountAndAccumulatorAccounts').value,
      saveEditedOperationsCopyingDocument: this.provisionCommonGroup.get('saveEditedOperationsCopyingDocument').value,
      inAccountFieldsNotLimitSelectionOfPartnerAccounts: this.provisionCommonGroup.get('inAccountFieldsNotLimitSelectionOfPartnerAccounts').value,
      allowToUseDiscountWhenSelling: this.provisionCommonGroup.get('allowToUseDiscountWhenSelling').value,
      allowDiscountsWhenPurchasing: this.provisionCommonGroup.get('allowDiscountsWhenPurchasing').value,
      exportHCIdentifier: this.provisionCommonGroup.get('exportHCIdentifier').value,
      groupReRegistrationOfDocuments: this.provisionCommonGroup.get('groupReRegistrationOfDocuments').value,
      showPartnerHVHHinLogsAndReports: this.provisionCommonGroup.get('showPartnerHVHHinLogsAndReports').value,
      importRatesOfKBWhenLogInToSystem: this.provisionCommonGroup.get('importRatesOfKBWhenLogInToSystem').value,
      participateCustomerExperienceImprovementProgram: this.provisionCommonGroup.get('participateCustomerExperienceImprovementProgram').value,
      analiticGroups: {
        countOfAnaliticGroups: true,
          keepAnalyticsFieldsUnderEachOther: false
      }
    }
    this._mainService.updateJsonByUrl(this._urls.provisionGeneralUrl, sendinDate).subscribe()
  }
private provisionValue
  public getProvisionValue () {
    this._mainService.getInformationByType(this._urls.provisionGeneralUrl).subscribe(
      (data) =>{
        this.provisionValue = data.data
      }
    )
  }
  public close(){}
  public setTodayDate(): Date {
    let today = new Date();
    return today
  }
}

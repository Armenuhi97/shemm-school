import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { AddProvisionsModal } from '../../../views/main/salary/modals';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../views/main/main.service';
import { LoadingService, AppService, OftenUsedParamsService } from '../../../services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @Input('title') public tabTitle
  public title = '';
  public organizationFormGroup: FormGroup;
  private _subscription: Subscription;
  public chartAccounts = [];
  public provisionOrganization = [];
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

    this._validate();
    this._getProvisionOrganization()
setTimeout(() => {
  this.organizationFormGroup.patchValue({
    main: {
      title: this.provisionOrganization['main'].title,
      businessAddress: this.provisionOrganization['main'].businessAddress,
      legalAddress:this.provisionOrganization['main'].legalAddress,
      phone: this.provisionOrganization['main'].phone,
      eMail: this.provisionOrganization['main'].eMail
    },
    numbers: {
      HVHH: this.provisionOrganization['numbers'].HVHH,
      stateRezGegisterNumber: this.provisionOrganization['numbers'].stateRezGegisterNumber,
      date: new Date(this.provisionOrganization['numbers'].date),
      taxAreaCode: this.provisionOrganization['numbers'].taxAreaCode,
      policyholderAccountNumber: this.provisionOrganization['numbers'].policyholderAccountNumber,
      numberOfShipmentRegistrationBook: this.provisionOrganization['numbers'].numberOfShipmentRegistrationBook
    },
    responsiblePersons: {
      headOfDepartment: this.provisionOrganization['responsiblePersons'].headOfDepartment,
      nameSurnamePatrioticOfHead: this.provisionOrganization['responsiblePersons'].nameSurnamePatrioticOfHead,
      accountantPosition: this.provisionOrganization['responsiblePersons'].accountantPosition,
      nameSurnamePatrioticOfAccountant: this.provisionOrganization['responsiblePersons'].nameSurnamePatrioticOfAccountant,
      nameSurnamePatrioticOfCashie: this.provisionOrganization['responsiblePersons'].nameSurnamePatrioticOfCashie
    } 
  })

}, 1000);


  }



  private _getProvisionOrganization() {
    return this._mainService.getInformationByType(this._urls.provisionOrganizationUrl).subscribe(
      ((data) => {
        this.provisionOrganization = data.data;
        console.log(this.provisionOrganization)
      }
    )
    )
  }

  // "main": {
  //   "title": "",
  //   "businessAddress": "",
  //   "legalAddress": "",
  //   "phone": "",
  //   "eMail": ""
  // }
  // "numbers": {
  //   "HVHH": "",
  //   "stateRezGegisterNumber": "",
  //   "date": "01/01/01",
  //   "taxAreaCode": "",
  //   "policyholderAccountNumber": "",
  //   "numberOfShipmentRegistrationBook": ""
  // }
  // "responsiblePersons": {
  //   "headOfDepartment": "",
  //   "nameSurnamePatrioticOfHead": "",
  //   "accountantPosition": "",
  //   "nameSurnamePatrioticOfAccountant": "",
  //   "nameSurnamePatrioticOfCashier": ""
  // }

  

  private _validate() {

    this.organizationFormGroup = this._fb.group({

      main: this._fb.group({
        title: [null, Validators.required],
        businessAddress: [null, Validators.required],
        legalAddress: [null, Validators.required],
        phone: [null, Validators.required],
        eMail: [null, Validators.required],
      }),
      numbers: this._fb.group({
        HVHH: [null, Validators.required],
        stateRezGegisterNumber: new FormControl(null),
        date: [this.setTodayDate()],
        taxAreaCode: [null, Validators.required],
        policyholderAccountNumber: [null, Validators.required],
        numberOfShipmentRegistrationBook: [null, Validators.required],
      }),
      responsiblePersons: this._fb.group({
        headOfDepartment: [null, Validators.required],
        nameSurnamePatrioticOfHead: [null, Validators.required],
        accountantPosition: [null, Validators.required],
        nameSurnamePatrioticOfAccountant: [null, Validators.required],
        nameSurnamePatrioticOfCashie: [null, Validators.required]
      })
    })
  }

  public addProvisionOrganization(): void {
 
    let sendingData = {
      main: {
        title: this.organizationFormGroup.get('main').value.title,
        businessAddress: this.organizationFormGroup.get('main').value.businessAddress,
        legalAddress: this.organizationFormGroup.get('main').value.legalAddress,
        phone: this.organizationFormGroup.get('main').value.phone,
        eMail: this.organizationFormGroup.get('main').value.eMail
      },
      numbers: {
        HVHH: this.organizationFormGroup.get('numbers').value.HVHH,
        stateRezGegisterNumber: this.organizationFormGroup.get('numbers').value.stateRezGegisterNumber,
        date: this._datePipe.transform(this.organizationFormGroup.get('numbers').value.date, 'MM/dd/yyyy'),
        taxAreaCode: this.organizationFormGroup.get('numbers').value.taxAreaCode,
        policyholderAccountNumber: this.organizationFormGroup.get('numbers').value.policyholderAccountNumber,
        numberOfShipmentRegistrationBook: this.organizationFormGroup.get('numbers').value.numberOfShipmentRegistrationBook
      },
      responsiblePersons: {
        headOfDepartment: this.organizationFormGroup.get('responsiblePersons').value.headOfDepartment,
        nameSurnamePatrioticOfHead: this.organizationFormGroup.get('responsiblePersons').value.nameSurnamePatrioticOfHead,
        accountantPosition: this.organizationFormGroup.get('responsiblePersons').value.accountantPosition,
        nameSurnamePatrioticOfAccountant: this.organizationFormGroup.get('responsiblePersons').value.nameSurnamePatrioticOfAccountant,
        nameSurnamePatrioticOfCashie: this.organizationFormGroup.get('responsiblePersons').value.nameSurnamePatrioticOfCashie
      }  
    }
    if (this.organizationFormGroup.valid) {
      this._mainService.updateJsonByUrl(this._urls.provisionOrganizationUrl, sendingData)
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
    this.organizationFormGroup.get(controlName).setValue(event);
  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.organizationFormGroup, controlName, property)
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
    // this._subscription.unsubscribe()
  }

}


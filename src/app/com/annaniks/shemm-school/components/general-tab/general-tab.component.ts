import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComponentDataService, AppService } from '../../services';
import { Subscription } from 'rxjs';
import { Partner, AnalyticalGroup, AccountPlan, JsonObjectType } from '../../models/global.models';
import { MatDialog } from '@angular/material/dialog';
import { AddPartnerModal } from '../../views/main/main-accounting/modals';

@Component({
  selector: 'general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss']
})
export class GeneralTabComponent implements OnInit {
  public commonGroup: FormGroup;
  private _subscription: Subscription;
  public analyticalGroup1: AnalyticalGroup[] = [];
  public analyticalGroup2: AnalyticalGroup[] = [];
  public partners: Partner[] = [];
  public chartAccounts: AccountPlan[] = [];
  public calculationTypes:JsonObjectType[]=[]
   @Output('isClickOnAddButton') private _isClick: EventEmitter<{ isClick: boolean, isValue: boolean }> = new EventEmitter()
  
  @Input('calculationTypes')
  set setcalculationTypes($event: JsonObjectType[]) {
      this.calculationTypes = $event
  }
  @Input('group')
  set setFormGroup($event) {
    if ($event) {
      this.commonGroup.patchValue($event)
      this._appService.markFormGroupTouched(this.commonGroup)
    }
  }
  @Input('chartAccounts')
  set setChartAccount($event: AccountPlan[]) {
    this.chartAccounts = $event
  }
  @Input('partners')
  set setPartners($event: Partner[]) {
    this.partners = $event
  }
  @Input('analyticalGroup1')
  set setAnalyticalGroup1($event: AnalyticalGroup[]) {
    this.analyticalGroup1 = $event
  }
  @Input('analyticalGroup2')
  set setAnalyticalGroup2($event: AnalyticalGroup[]) {
    this.analyticalGroup2 = $event
  }

  constructor(private _fb: FormBuilder, private _appService: AppService,
    private _componentDataService: ComponentDataService,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _matDialog: MatDialog,
    @Inject('URL_NAMES') private _urls) {
    this._validate()
  }

  ngOnInit() {
    this._sendData()
  }
  private _sendData() {
    this._subscription = this._componentDataService.getState().subscribe((data) => {
      if (data.isSend) {
        if (this.commonGroup) {
          let isValid = this.commonGroup && this.commonGroup.valid ? true : false;
          this._componentDataService.sendData(this.commonGroup.value, 'general', isValid)
        }
      }
    })
  }
  private _validate() {
    this.commonGroup = this._fb.group({
      propertyCard: [null],
      folderNumber: [null],
      partner: [null],
      partnerAccount: [null],
      analyticalGroup1: [null],
      analyticalGroup2: [null],
      acquisitionDocument: [null],
      acquisitionDate: [null],
      statementMethod: ['էլեկտրոնային'],
      calculateType: [null]
    })
  }
  public addPartner() {
    this._isClick.emit({ isClick: false, isValue: false })
    this._subscription.unsubscribe();
    let title = 'Մատակարար (Նոր)';
    let dialog = this._matDialog.open(AddPartnerModal, {
      width: '80vw',
      minHeight: '55vh',
      maxHeight: '85vh',
      data: { title: title, url: this._urls.partnerGetOneUrl },
      autoFocus: false,

    })
    dialog.afterClosed().subscribe((data) => {
      this._sendData();
      if (data) {
        if (data.value) {
          this._isClick.emit({ isClick: true, isValue: true })

        } else {
          this._isClick.emit({ isClick: true, isValue: false })
        }
      } else {
        this._isClick.emit({ isClick: true, isValue: false })
      }
    })
  }
  public setTodayDate(): Date {
    let today = new Date();
    return today
  }
  public setValue(event, controlName: string): void {
      this.commonGroup.get(controlName).setValue(event);
      this.onFocus(this.commonGroup,controlName)

  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.commonGroup, controlName, property)
  }
  public setModalParams(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  public onFocus( form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }
  ngOnDestroy() {
    this._subscription.unsubscribe()
  }
}

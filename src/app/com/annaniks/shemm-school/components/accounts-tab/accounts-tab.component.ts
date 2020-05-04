import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService, ComponentDataService } from '../../services';
import { Subscription } from 'rxjs';
import { AccountPlan } from '../../models/global.models';

@Component({
  selector: 'accounts-tab',
  templateUrl: './accounts-tab.component.html',
  styleUrls: ['./accounts-tab.component.scss']
})
export class AccountsTabComponent implements OnInit {
  public accountsGroup: FormGroup;
  private _subscription: Subscription;
  public chartAccounts: AccountPlan[] = []
  @Input('group')
  set setFormGroup($event) {
    if ($event) {
      this.accountsGroup.patchValue($event)
      this._appService.markFormGroupTouched(this.accountsGroup)
    }
  }
  @Input('chartAccounts')
  set setChartAccount($event: AccountPlan[]) {
    this.chartAccounts = $event
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
        if (this.accountsGroup) {
          let isValid = this.accountsGroup && this.accountsGroup.valid ? true : false;
          this._componentDataService.sendData(this.accountsGroup.value, 'accounts', isValid)
        }
      }
    })
  }
  private _validate() {
    this.accountsGroup = this._fb.group({
      initialCostAccount: [null],
      wornAccount: [null],
      expenseAccount: [null],
      incomeStatement: [null],
      currentPortionOfDeferredRevenueAccount: [null],
      deferredRevenueAccount: [null]
    })
  }
  public setValue(event, controlName: string): void {
      this.accountsGroup.get(controlName).setValue(event);
      this.onFocus(this.accountsGroup,controlName)
  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.accountsGroup, controlName, property)
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

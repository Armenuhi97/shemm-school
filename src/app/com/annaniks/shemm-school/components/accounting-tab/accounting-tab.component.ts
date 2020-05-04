import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentDataService, AppService } from '../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'accounting-tab',
  templateUrl: './accounting-tab.component.html',
  styleUrls: ['./accounting-tab.component.scss']
})
export class AccountingTabComponent implements OnInit {
  public accountingGroup:FormGroup;
  private _subscription: Subscription;
  @Input('group')
  set setFormGroup($event) {
    if ($event) {
      this.accountingGroup.patchValue($event)
      this._appService.markFormGroupTouched(this.accountingGroup)
    }
  }
  constructor(private _fb: FormBuilder, private _appService: AppService,
    private _componentDataService: ComponentDataService,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _matDialog:MatDialog,
    @Inject('URL_NAMES') private _urls) {
    this._validate()
  }
  ngOnInit() {
    this._sendData()
  }
  private _sendData(){
    this._subscription = this._componentDataService.getState().subscribe((data) => {
      if (data.isSend) {
        if (this.accountingGroup) {
          let isValid = this.accountingGroup && this.accountingGroup.valid ? true : false;
          this._componentDataService.sendData(this.accountingGroup.value, 'accounting', isValid)
        }
      }
    })
  }
  private _validate() {
    this.accountingGroup = this._fb.group({
      financeUsefulLife:[null,Validators.required],
      financeInitialCost:[null,Validators.required],
      financeCalculatedWear:[null],
      financeResidualValue:[null],
      financeIsWorn:[false],

      taxUsefulLife:[null],
      taxInitialCost:[null],
      taxCalculatedWear:[null],
      taxResidualValue:[null],
      taxIsWorn:[false],

      financialUsefulLife:[null],
      financialCalculatedWear:[null],
      financialIsWorn:[false],
      financeDeferredRevenue:[null]

    })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}

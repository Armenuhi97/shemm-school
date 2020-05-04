import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentDataService, AppService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'additional-tab',
  templateUrl: './additional-tab.component.html',
  styleUrls: ['./additional-tab.component.scss']
})
export class AdditionalTabComponent implements OnInit {
  public additionalGroup: FormGroup;
  private _subscription: Subscription;
  @Input('group')
  set setFormGroup($event) {
    if ($event) {
      this.additionalGroup.patchValue($event)
      this._appService.markFormGroupTouched(this.additionalGroup)
    }
  }
  constructor(private _fb: FormBuilder, private _appService: AppService,
    private _componentDataService: ComponentDataService,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    @Inject('URL_NAMES') private _urls) {
    this._validate()
  }
  ngOnInit() {
    this._sendData()
  }
  private _sendData() {
    this._subscription = this._componentDataService.getState().subscribe((data) => {
      if (data.isSend) {
        if (this.additionalGroup) {
          let isValid = this.additionalGroup && this.additionalGroup.valid ? true : false;
          this._componentDataService.sendData(this.additionalGroup.value, 'additional', isValid)
        }
      }
    })
  }
  private _validate() {
    this.additionalGroup = this._fb.group({
      startYear:[null],
      serialNumber:[null],
      technicalProfile:[null],
      stamp:[null],
      briefReview:[null],
      manufacturer:[null]
    })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

}

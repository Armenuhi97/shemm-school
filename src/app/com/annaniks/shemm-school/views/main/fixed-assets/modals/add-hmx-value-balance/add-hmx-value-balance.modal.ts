import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { HmxValueOfBalanceDetail, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  templateUrl: './add-hmx-value-balance.modal.html',
  styleUrls: ['./add-hmx-value-balance.modal.scss']
})
export class AddHmxValueBalanceModal implements OnInit {

  public formGroup: FormGroup;
  public title = 'ՀՄ խումբ շահութահարկի օրենքով';
  public errorWithServerResponce: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<AddHmxValueBalanceModal>,
    private _mainService: MainService,
    private _fb: FormBuilder,
    private _loadingService: LoadingService) { }

  ngOnInit() {
    this._validate();
    this.checkMatDialogData();
  }

  private checkMatDialogData() {
    if (this._data.item) {
      const { date, code, valueBeginningOfYear } = this._data.item
      this.formGroup.setValue({
        date,
        code,
        valueBeginningOfYear

      })
    } else {
      this._generateCode()
    }
  }
  private _generateCode(): void {
    this._loadingService.showLoading()
    this._mainService.generateField('hmx_value_balance', 'code').subscribe((data: ServerResponse<GenerateType>) => {
      if (data.data.message.maxColumValue !== 'null')
        this.formGroup.get('code').setValue(data.data.message.maxColumValue);
      this._loadingService.hideLoading()
    }, () => { this._loadingService.hideLoading() })
  } public close() {
    this._dialogRef.close()
  }

  private _validate() {
    this.formGroup = this._fb.group({
      code: [null, Validators.required],
      date: [null, Validators.required],
      valueBeginningOfYear: [null, Validators.required]

    })
  }

  public addHmxValueBalance() {
    let sendingData: HmxValueOfBalanceDetail = this.formGroup.value;

    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.errorWithServerResponce = error.error.message
          }
        )
    } else {
      this._mainService.addByUrl(`${this._data.url}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.errorWithServerResponce = error.error.message
          }
        )
    }
  }

}


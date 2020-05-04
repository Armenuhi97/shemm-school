import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { HmxProfitTaxDetail, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  selector: 'app-add-by-tax-law',
  templateUrl: './add-by-tax-law.modal.html',
  styleUrls: ['./add-by-tax-law.modal.scss']
})
export class AddByTaxLawModal implements OnInit {

  public formGroup: FormGroup;
  public title = 'ՀՄ խումբ շահութահարկի օրենքով';
  public errorWithServerResponce: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<AddByTaxLawModal>,
    private _mainService: MainService,
    private _fb: FormBuilder,
    private _loadingService: LoadingService) { }

  ngOnInit() {
    this._validate();
    this.checkMatDialogData();
  }

  private checkMatDialogData() {
    if (this._data.item) {
      const { name, code, yearPrice } = this._data.item
      this.formGroup.setValue({
        name,
        code,
        yearPrice
      })
    } else {
      this._generateCode()
    }
  }
  private _generateCode(): void {
    this._loadingService.showLoading()
    this._mainService.generateField('hmx_profit_tax', 'code').subscribe((data: ServerResponse<GenerateType>) => {
      if (data.data.message.maxColumValue !== 'null')
        this.formGroup.get('code').setValue(data.data.message.maxColumValue);
      this._loadingService.hideLoading()
    }, () => { this._loadingService.hideLoading() })
  }
  public close() {
    this._dialogRef.close()
  }

  private _validate() {
    this.formGroup = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      yearPrice: [null, Validators.required]

    })
  }

  public addByTaxLaw() {
    let sendingData: HmxProfitTaxDetail = this.formGroup.value;

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
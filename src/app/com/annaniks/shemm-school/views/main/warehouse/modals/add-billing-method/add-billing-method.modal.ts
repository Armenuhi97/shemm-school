import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { BillingMethodPayload, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  selector: 'app-add-billing-method',
  templateUrl: './add-billing-method.modal.html',
  styleUrls: ['./add-billing-method.modal.scss']
})
export class AddBillingMethodModal implements OnInit {

  public billingMethotForm: FormGroup;
  public title: string;
  public errorWithServerResponce: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) private _data: {title: string, url: string, id: number, item: BillingMethodPayload},
    private _dialogRef: MatDialogRef<AddBillingMethodModal>,
    private _mainService: MainService,
    private _loadingService:LoadingService,
    private _fb: FormBuilder) {
      this.title=this._data.title
     }

  ngOnInit() {
    this._validate();
    this.checkMatDialogData();
  }

  private checkMatDialogData(): void {
    if (this._data.id && this._data) {
      const { name, abbreviation } = this._data.item
      this.billingMethotForm.setValue({
        name,
        abbreviation

      })
    }else{
      this._generateDocumentNumber()
    }
  }

  public close(): void {
    this._dialogRef.close()
  }

  private _validate(): void {
    this.billingMethotForm = this._fb.group({
      name: [null, Validators.required],
      abbreviation: [null, Validators.required]

    })
  }
  private _generateDocumentNumber(): void {
    this._loadingService.showLoading()
    this._mainService.generateField('billing_method', 'name').subscribe((data: ServerResponse<GenerateType>) => {
      this.billingMethotForm.get('name').setValue(data.data.message.maxColumValue);
      this._loadingService.hideLoading()
    },
      () => { this._loadingService.hideLoading() })
  }
  public addBillingMethod(): void {
    let sendingData: BillingMethodPayload = this.billingMethotForm.value;

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

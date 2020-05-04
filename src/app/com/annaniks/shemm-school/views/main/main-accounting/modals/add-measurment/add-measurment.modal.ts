import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IMeasurementUnitPayload, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  selector: 'app-add-measurment',
  templateUrl: './add-measurment.modal.html',
  styleUrls: ['./add-measurment.modal.scss']
})
export class AddMeasurmentModal implements OnInit, OnDestroy {
  public formGroup: FormGroup;
  private _subscription: Subscription;
  public title = 'Չափման միավոր (Նոր)';

  constructor(@Inject(MAT_DIALOG_DATA) private _data: {title: string, url: string, id?: number, item?: IMeasurementUnitPayload},
    private _mainService: MainService,
    private _dialogRef: MatDialogRef<AddMeasurmentModal>,
    private _fb: FormBuilder,
    private _loadingService:LoadingService) { }

  ngOnInit() {
    this._validate();
    this.checkMatDialogData();
  }

  private checkMatDialogData() {
    if (this._data.item) {
      const { code, unit, abbreviation } = this._data.item
      this.formGroup.patchValue({
        code,
        unit,
        abbreviation
      })
    }else{
      this._generateDocumentNumber()
    }
  }
  private _generateDocumentNumber(): void {
    this._loadingService.showLoading()
    this._mainService.generateField('services', 'code').subscribe((data: ServerResponse<GenerateType>) => {
        this.formGroup.get('code').setValue(data.data.message.maxColumValue);
        this._loadingService.hideLoading()
    }, () => { this._loadingService.hideLoading() })
}
  public close(): void {
    this._dialogRef.close()
  }

  private _validate(): void {
    this.formGroup = this._fb.group({
      code: [null, Validators.required],
      unit: [null, Validators.required],
      abbreviation: [null, Validators.required]
    })
  }
  public addForm(): void {
    let sendingData: IMeasurementUnitPayload = this.formGroup.value;

    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => { }
        )
    } else {
      this._mainService.addByUrl(`${this._data.url}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) })
    }
  }

  ngOnDestroy(): void {
    if(this._subscription){
      this._subscription.unsubscribe()
    }
  }
}

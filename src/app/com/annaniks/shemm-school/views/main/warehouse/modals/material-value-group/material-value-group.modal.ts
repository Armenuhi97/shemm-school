import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { MaterialValueGroupDetail, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
  selector: 'app-material-value-group',
  templateUrl: './material-value-group.modal.html',
  styleUrls: ['./material-value-group.modal.scss']
})
export class MaterialValueGroupModal implements OnInit {

  public materialGroup: FormGroup;
  public title: string;
  public errorWithServerResponce: string = '';
  public materialvalueGroups = []
  public modalParams = { tabs: ['Կոդ', 'Խումբ'], title: 'Խումբ', keys: ['code', 'name'] };

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<MaterialValueGroupModal>,
    private _mainService: MainService,
    private _fb: FormBuilder,
    private _appService: AppService,
    private _loadingService: LoadingService) {
    this.title = this._data.title
    this.materialvalueGroups = this._data.array
  }

  ngOnInit() {
    this._validate();
    this.checkMatDialogData();
  }

  private checkMatDialogData() {
    if (this._data.id && this._data) {
      const { name, code, materialValueGroupId = null } = this._data.item
      this.materialGroup.setValue({
        name,
        code,
        materialValueGroupId
      })
    }else{
      this._generateDocumentNumber()
    }
  }

  public close() {
    this._dialogRef.close()
  }

  private _validate() {
    this.materialGroup = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      materialValueGroupId: [null]

    })
  }

  private _generateDocumentNumber(): void {
    this._loadingService.showLoading()
    this._mainService.generateField('material_value_group', 'code').subscribe((data: ServerResponse<GenerateType>) => {
      this.materialGroup.get('code').setValue(data.data.message.maxColumValue);
      this._loadingService.hideLoading()
    },
      () => { this._loadingService.hideLoading() })
  }
  public addMaterialValueGroup() {
    let sendingData: MaterialValueGroupDetail = {
      name: this.materialGroup.get('name').value,
      code: this.materialGroup.get('code').value,
      materialValueGroupId: this._appService.checkProperty(this.materialGroup.get('materialValueGroupId').value, 'id')
    }

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
  public setValue(event, controlName?) {
    this.materialGroup.get(controlName).setValue(event);
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.materialGroup, controlName, property)
  }

}

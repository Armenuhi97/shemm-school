import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { OftenUsedParamsService, LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MessageService } from 'primeng/api/';

@Component({
  selector: 'app-warehouse-provisions',
  templateUrl: './warehouse-provisions.modal.html',
  styleUrls: ['./warehouse-provisions.modal.scss']
})
export class WarehouseProvisionsModal implements OnInit {

  public title: string;
  public warehouseProvisionsGroup: FormGroup;
  public chartAccounts = [];
  public warehouseProvisions;
  private _subscription: Subscription;

  constructor(private _dialogRef: MatDialogRef<WarehouseProvisionsModal>,
    @Inject(MAT_DIALOG_DATA) private _data: { label: string },
    @Inject('URL_NAMES') private _urls,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _mainService: MainService,
    private _messageService: MessageService,
    private _oftenUsedParamsService: OftenUsedParamsService,
    private _fb: FormBuilder) {
    this.title = this._data.label
  }

  ngOnInit() {
    this._validate();
  }

  private _validate() {
    this.warehouseProvisionsGroup = this._fb.group({
      accountAAH: [null, Validators.required],
      aahPercent: [null, Validators.required],
      aahNeraryalPercent: [null, Validators.required]
    })
    this._combineObservable();

  }

  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
      this._mainService.getInformationByType(this._urls.warehouseGeneralUrl)
    )
    this._subscription = combine.subscribe((data) => {
      if (data) {
        this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
        this.warehouseProvisions = data[1].data;
        this._checkMatDialogData()
        this._loadingService.hideLoading()
      }
    })
  }

  private _checkMatDialogData(): void {
    if (this.warehouseProvisions != null) {
      const { accountAAH, aahPercent, aahNeraryalPercent } = this.warehouseProvisions;
      let accountObj = this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), accountAAH, 'id'), 0);
      this.warehouseProvisionsGroup.patchValue({
        accountAAH: accountObj,
        aahPercent,
        aahNeraryalPercent
      })
    }
  }

  public close(): void {
    this._dialogRef.close();
  }

  public addWarehouseProvisions(): void {
    this._loadingService.showLoading();
    if (this.warehouseProvisionsGroup.valid) {
      let sendingDada = {
        accountAAH: this._appService.checkProperty(this.warehouseProvisionsGroup.get('accountAAH').value, 'id'),
        aahPercent: this.warehouseProvisionsGroup.get('aahPercent').value,
        aahNeraryalPercent: this.warehouseProvisionsGroup.get('aahNeraryalPercent').value
      }
      this._mainService.updateJsonByUrl(this._urls.warehouseGeneralUrl, sendingDada)
        .subscribe((data) => {
          this.close();
          this._loadingService.hideLoading()
        },
          (err) => {
            this._mainService.translateServerError(err);
            this._loadingService.hideLoading()
          })
    }
  }

  public setValue(event, controlName?) {
    this.warehouseProvisionsGroup.get(controlName).setValue(event);
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.warehouseProvisionsGroup, controlName, property)
  }

  public setModalParams(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }

}

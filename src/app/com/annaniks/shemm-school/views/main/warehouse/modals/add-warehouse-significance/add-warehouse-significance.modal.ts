import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../../main.service';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription } from 'rxjs';
import { WarehouseSignificancePayload } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-warehouse-significance',
  templateUrl: './add-warehouse-significance.modal.html',
  styleUrls: ['./add-warehouse-significance.modal.scss']
})
export class AddWarehouseSignificanceModal implements OnInit {

  public title: string;
  public warehouseSignificanceGroup: FormGroup;
  private _subscription: Subscription;
  private _error
  public chartAccounts = [];
  public modalAccontPlans = { tabs: ['Հաշիվ', 'Անվանւմ'], title: 'Հաշիվ', keys: ['account', 'name'] }


  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<AddWarehouseSignificanceModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _messageService: MessageService,
    private _oftenUsedParamsService: OftenUsedParamsService,
    @Inject('URL_NAMES') private _urls
  ) {
    this.title = this._data.title;
    this._validate()

  }

  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
    )
    this._subscription = combine.subscribe((data) => {
      if (data) {
        this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
        this._loadingService.hideLoading()
      }
    })
  }

  ngOnInit() {
    this._checkMatDialogData()
  }

  private _checkMatDialogData(): void {
    if (this._data.id && this._data.item) {
      const { name } = this._data.item
      this.warehouseSignificanceGroup.patchValue({
        name,
        expenseAccountId: this._data.item.expenseAccount,
        partnerAccountId: this._data.item.partnerAccount,
        prepaymentAccountId: this._data.item.prepaymentAccount
      })
      this.onFocus(this.warehouseSignificanceGroup, 'name')
    }
  }

  private _validate(): void {
    this.warehouseSignificanceGroup = this._fb.group({
      name: [null, Validators.required],
      expenseAccountId: [null, Validators.required],
      partnerAccountId: [null, Validators.required],
      prepaymentAccountId: [null, Validators.required]
    })
    this._combineObservable()
  }

  public addWarehouseSignificance(): void {
    let sendingData: WarehouseSignificancePayload = {
      name: this.warehouseSignificanceGroup.get('name').value,
      expenseAccountId: this._appService.checkProperty(this.warehouseSignificanceGroup.get('expenseAccountId').value, 'id'),
      partnerAccountId: this._appService.checkProperty(this.warehouseSignificanceGroup.get('partnerAccountId').value, 'id'),
      prepaymentAccountId: this._appService.checkProperty(this.warehouseSignificanceGroup.get('prepaymentAccountId').value, 'id')
    };

    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
        .subscribe(
          (data) => {
            this._dialogRef.close({ value: true, id: this._data.id }),
              this._messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
          },
          (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading();
          }
        )
    } else {
      this._mainService.addByUrl(`${this._data.url}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading();
          })
    }
  }


  public close(): void {
    this._dialogRef.close()
  }

  public onFocus(form: FormGroup, controlName: string): void {
    form.get(controlName).markAsTouched()
  }
  public setValue(event, controlName): void {
    this.warehouseSignificanceGroup.get(controlName).setValue(event);
    this.onFocus(this.warehouseSignificanceGroup, controlName)

  }
  public setInputValue(item, controlName: string, property: string) {
    return this._appService.setInputValue(item, controlName, property)
  }
  ngOnDestroy() {
    this._loadingService.hideLoading()
    this._subscription.unsubscribe()
  }
  get error(): string {
    return this._error
  }


}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-system-addition',
  templateUrl: './add-system-addition.modal.html',
  styleUrls: ['./add-system-addition.modal.scss']
})
export class AddSystemAdditionModal implements OnInit {

  public title = '';
  private _subscription: Subscription;
  public chartAccounts = [];
  public provisions = [];
  private _error;
  public formGroup: FormGroup;
  public errorWithServerResponce: string = '';

  constructor(private _dialogRef: MatDialogRef<AddSystemAdditionModal>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    private _oftenUsedParams: OftenUsedParamsService,
    private _fb: FormBuilder,
    @Inject('URL_NAMES') private _urls) {
    this.title = this._data.title;
  }


  ngOnInit() {
    this._validate();
  }

  private checkMatDialogData() {
    if (this._data.item) {
      this._data.item.accounts = this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._data.item.accountId, 'account'), 0);
      this.formGroup.patchValue({
        name: this._data.item.name,
        code: this._data.item.code,
        account: this._data.item.accounts,
        income_tax_withheld: this._data.item.income_tax_withheld
      })
    }
  }

  public close() {
    this._dialogRef.close()
  }

  private _validate() {
    this.formGroup = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      account: [null],
      income_tax_withheld: [false, Validators.required]
    })
    this._combineObservable()
  }


  private _combineObservable() {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._mainService.getAccountsPlan(),
    )
    this._subscription = combine.subscribe((data) => {
      this.chartAccounts = this._oftenUsedParams.getChartAccounts();
      this.checkMatDialogData();
      this._loadingService.hideLoading()
    })
  }


  public addSystemAddition() {
    if (this.formGroup.valid ) {
      let sendingData = {
        code: this.formGroup.get('code').value,
        name: this.formGroup.get('name').value,
        account: (this.formGroup.get('account').value) ? this.formGroup.get('account').value.id : null,
        income_tax_withheld: this.formGroup.get('income_tax_withheld').value,
        accountId: (this.formGroup.get('account').value) ? this.formGroup.get('account').value.account : null,
      };
      if (this._data.item) {
        this._data.systemAddition[this._data.id] = sendingData
        this._mainService.updateJsonByUrl(this._urls.systemAdditionUrl, this._data.systemAddition)
          .subscribe((data) => { this._dialogRef.close({ value: true }) },
            (error) => {
              this.errorWithServerResponce = error.error.message
            }
          )
      } else {
        this._data.systemAddition.push(sendingData);
        this._mainService.updateJsonByUrl(this._urls.systemAdditionUrl, this._data.systemAddition)
          .subscribe((data) => { this._dialogRef.close({ value: true }) },
            (error) => {
              this.errorWithServerResponce = error.error.message
            }
          )
      }
      console.log(this._data.systemAddition)
    }
  }

  public setValue(event, controlName: string): void {
    this.formGroup.get(controlName).setValue(event);
  }
  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.formGroup, controlName, property)
  }
  public setModalParams(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  get error(): string {
    return this._error
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe()

  }

}
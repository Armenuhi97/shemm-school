import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AccountPlans, ServerResponse, Partners } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-operation-significance',
  templateUrl: './add-operation-significance.modal.html',
  styleUrls: ['./add-operation-significance.modal.scss']
})
export class AddOperationSignificanceModal implements OnInit {

  public operationSignificanceGroup: FormGroup;
  public title: string;
  public serverResponseError: string = '';
  private _accountPlanMainUrl = 'account-plans'
  public partners = [];
  private _subscription: Subscription;
  public accountPlans: AccountPlans[] = [];
  public modalParamsAccount = { tabs: ['Կոդ', 'Անվանում'], title: 'Հաշիվներ', keys: ['account', 'name'] }

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { title: string, url: string, id?: number, item?: any },
    private _dialogRef: MatDialogRef<AddOperationSignificanceModal>,
    private _mainService: MainService,
    private _appService: AppService,
    private _loadingService: LoadingService,
    private _fb: FormBuilder) {
    this.title = this._data.title
  }

  ngOnInit() {
    this._validate();
    this._checkMatDialogData()
  }

  private _validate(): void {
    this.operationSignificanceGroup = this._fb.group({
      name: [null, Validators.required],
      inflowAccountId: [null],
      leakageAccountId: [null],
      partnerAccountId: [null]
    })
    this._combineObservable()
  }

  public close(): void {
    this._dialogRef.close()
  }

  private _checkMatDialogData(): void {
    if (this._data.item) {
      const { name, inflowAccount, leakageAccount, partnerAccount } = this._data.item
      this.operationSignificanceGroup.patchValue({
        name,
        inflowAccountId: inflowAccount,
        leakageAccountId: leakageAccount,
        partnerAccountId: partnerAccount
      })
    }
  }


  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getAccountPlans(this._accountPlanMainUrl, 0, 0)
    )
    this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
  }


  private _getAccountPlans(url: string, limit: number, offset: number): Observable<ServerResponse<AccountPlans[]>> {
    return this._mainService.getByUrl(url, limit, offset).pipe(
      map((data: ServerResponse<AccountPlans[]>) => {
        this.accountPlans = data.data
        return data
      })
    )
  }
  // this._appService.checkProperty(this.warehouseSignificanceGroup.get('expenseAccountId').value, 'id'),
  public addOperationSignificanceGroup(): void {
    let operationSignificanceObject = this.operationSignificanceGroup;
    let sendingData = {
      name: operationSignificanceObject.get('name').value,
      inflowAccountId: this._appService.checkProperty(operationSignificanceObject.get('inflowAccountId').value, 'id'),
      leakageAccountId: this._appService.checkProperty(operationSignificanceObject.get('leakageAccountId').value, 'id'),
      partnerAccountId: this._appService.checkProperty(operationSignificanceObject.get('partnerAccountId').value, 'id')
    }
    console.log(sendingData);

    if (this._data.id && this._data.item) {
        this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
            .subscribe(
                (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                (error) => {
                    this.serverResponseError = error.error.data[0].message;
                }
            )
    } else {
        this._mainService.addByUrl(`${this._data.url}`, sendingData)
            .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                (error) => {
                    this.serverResponseError = error.error.data[0].message;
                }
            )
    }
  }

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.operationSignificanceGroup, controlName, property)
  }

  public setValue(event, controlName?): void {
    this.operationSignificanceGroup.get(controlName).setValue(event);
  }


  public setModalParams(title: string, propertyTitle: string, property: string) {
    let modalParams = { tabs: [propertyTitle, 'Անվանում'], title: title, keys: [property, 'name'] };
    return modalParams
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe()
    }
  }



}

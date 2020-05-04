import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { HmTypeDetail, AccountPlans, ServerResponse, DataCount, HmxProfitTaxDetail } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services/loading.service';
import { AppService } from 'src/app/com/annaniks/shemm-school/services';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-hm-type',
  templateUrl: './add-hm-type.modal.html',
  styleUrls: ['./add-hm-type.modal.scss']
})
export class AddHmTypeModal implements OnInit {

  public hmTypeGroup: FormGroup;
  public title: string = '';
  private url = 'fff';
  public errorWithServerResponce: string = '';
  private _subscription: Subscription;
  public accountPlans: AccountPlans[] = [];
  public hmTypesData: HmTypeDetail[] = [];
  public addByTaxLawData: HmxProfitTaxDetail[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private _data: { title: string, url: string, id: number | undefined, item: HmTypeDetail | undefined },
    private _dialogRef: MatDialogRef<AddHmTypeModal>,
    private _fb: FormBuilder,
    private _mainService: MainService,
    private _loadingService: LoadingService,
    private _appService: AppService,
    @Inject('URL_NAMES') private _urls
  ) {
    this.title = 'Ավելացնել ՀՄ տեսակ';
  }
  ngOnInit() {
    this._validate();
    this._checkMatDialogData();
    console.log(this._data)
  }

  private _checkMatDialogData(): void {
    if (this._data.item) {
      const {
        name,
        code,
        initialAccountId,
        parentId,
        staleAccountId,
        usefullServiceDuration,
        hmxProfitTaxId
      } = this._data.item;

      this.hmTypeGroup.setValue({
        name,
        code,
        initialAccountId,
        parentId,
        staleAccountId,
        usefullServiceDuration,
        hmxProfitTaxId
      })
    }
  }

  public close() {
    this._dialogRef.close();
  }

  private _validate(): void {
    this.hmTypeGroup = this._fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      initialAccountId: [null],
      staleAccountId: [null],
      usefullServiceDuration: [null],
      hmxProfitTaxId: [null],
      parentId: [null]
    })
    this._combineObservable()
  }


  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getAccountsPlanCount(),
      this._getByTaxLaw(),
      this._getHmTypes()
    )
    this._subscription = combine.subscribe((data) => {
      if (data) {
        this._loadingService.hideLoading()
      }
    },
      () => {
        this._loadingService.hideLoading()
      })
  }

  private _getHmTypes(limit: number = 0, offset: number = 0): Observable<ServerResponse<HmTypeDetail[]>> {
    return this._mainService.getByUrl(this._urls.hmTypesMainUrl, limit, offset).pipe(
      map((data: ServerResponse<HmTypeDetail[]>) => {
        this.hmTypesData = data.data;
        return data
      })
    )
  }

  private _getAccountsPlanCount(): Observable<ServerResponse<AccountPlans[]>> {
    return this._mainService.getCount(this._urls.accountPlanMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getAccountsPlan(data.data.count)
      })
    )
  }

  private _getAccountsPlan(count: number): Observable<ServerResponse<AccountPlans[]>> {
    return this._mainService.getByUrl(this._urls.accountPlanMainUrl, count, 0).pipe(
      map((data: ServerResponse<AccountPlans[]>) => {
        this.accountPlans = data.data;
        return data
      })
    )
  }

  private _getByTaxLaw(limit: number = 0, offset: number = 0): Observable<ServerResponse<HmxProfitTaxDetail[]>> {
    return this._mainService.getByUrl(this._urls.hmxProfitTaxsMainUrl, limit, offset).pipe(
      map((data: ServerResponse<HmxProfitTaxDetail[]>) => {
        this.addByTaxLawData = data.data;
        return data
      })
    )
  }

  public addHmType() {
    let sendingData: HmTypeDetail = {
      name: this.hmTypeGroup.get('name').value,
      code: this.hmTypeGroup.get('code').value,
      initialAccountId: this._appService.checkProperty(this.hmTypeGroup.get('initialAccountId').value, 'id'),
      parentId: this._appService.checkProperty(this.hmTypeGroup.get('parentId').value, 'id') ,
      staleAccountId: this._appService.checkProperty(this.hmTypeGroup.get('staleAccountId').value, 'id'),      //gt
      usefullServiceDuration: this.hmTypeGroup.get('usefullServiceDuration').value,
      hmxProfitTaxId: this._appService.checkProperty(this.hmTypeGroup.get('hmxProfitTaxId').value, 'id' )            // hnj
    };
    console.log(77, sendingData)
    if (this._data.id && this._data.item) {
      this._mainService.updateByUrl(`${this._urls.hmTypesGetOneUrl}`, this._data.id, sendingData)
        .subscribe(
          (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.errorWithServerResponce = error.error.message
          }
        )
    } else {
      this._mainService.addByUrl(`${this._urls.hmTypesGetOneUrl}`, sendingData)
        .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
          (error) => {
            this.errorWithServerResponce = error.error.message
          }
        )
    }
  }

  public setValue(event, controlName: string, form: FormGroup = this.hmTypeGroup) {
      form.get(controlName).setValue(event)
    
  }

  public setModalParams(title: string, codeKeyName: string) {
    let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
    return modalParams
  }
  public setInputValue(controlName: string, property: string, form = this.hmTypeGroup) {
    return this._appService.setInputValue(form, controlName, property)
  }
  ngOnDestroy() {
    this._subscription.unsubscribe()
  }



}

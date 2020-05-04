import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PriceOfServicesDetail, ServerResponse, DataCount, ServicesDetail } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { switchMap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


@Component({
  templateUrl: './add-price-of-service.modal.html',
  styleUrls: ['./add-price-of-service.modal.scss']
})
export class AddPriceOfServiceModal implements OnInit {

  public addPriceOfServiceGroup: FormGroup;
  public title: string = 'Ծառայության գներ';
  public serverResponseError: string = '';
  private _servicesUrl = 'services';
  private _typesUrl:string = 'information-by-type/typeOfPrice';
  public servicesValue = [];
  public types = []
  private _subscription: Subscription;
  public modalParamsService = { tabs: ['Կոդ', 'Անվանում'], title: 'Ծառայություն', keys: ['id', 'name'] };
  public modalParamsTypes = { tabs: ['Կոդ', 'Անվանում'], title: 'Գների տեսակներ', keys: ['id', 'name'] }


  constructor(
    private _fb: FormBuilder,
    @Inject('CALENDAR_CONFIG') public calendarConfig,
    private _dialogRef: MatDialogRef<AddPriceOfServiceModal>,
    @Inject(MAT_DIALOG_DATA) private _data,
    private _mainService: MainService,
    private _appService: AppService,
    private _loadingService: LoadingService,
    private _datePipe: DatePipe
  ) {
    this.title = this._data.label
  }

  ngOnInit() {
    this._validate();
    this._checkMatDialogData()
  }

  public close() {
    this._dialogRef.close()
  }

  private _validate(): void {
    this.addPriceOfServiceGroup = this._fb.group({
      startDate: [null, Validators.required],
      endDate: [null],
      servicesId: [],
      type: [null]
    })
    this._combineObservable()
  }

  private _checkMatDialogData() {
    if (this._data.item) {
      const { startDate, endDate, servicesId, type } = this._data.item
      this.addPriceOfServiceGroup.patchValue({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        servicesId,
        type
      })
    }
  }

  private _combineObservable(): void {
    this._loadingService.showLoading()
    const combine = forkJoin(
      this._getServicesCount(),
      this._getTypes()
    )
    this._subscription = combine.subscribe(
      ()=>{this._loadingService.hideLoading()}

    )
  }

  private _getServicesCount(): Observable<ServerResponse<ServicesDetail[]>> {
    return this._mainService.getCount(this._servicesUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        return this._getServices(data.data.count)
      })
    )
  }

  private _getServices(count: number): Observable<ServerResponse<ServicesDetail[]>> {
    return this._mainService.getByUrl(this._servicesUrl, count, 0).pipe(
      map((data: ServerResponse<ServicesDetail[]>) => {
        this.servicesValue = data.data;
        return data
      })
    )
  }

  private _getTypes() {
    return this._mainService.getInformationByType(this._typesUrl).pipe(
      map((data)=>{
        this.types = data.data
      })
    )
  }


  public addCashRegister(): void {
    this._loadingService.showLoading()
    let sendingData: PriceOfServicesDetail = {
      startDate: this._datePipe.transform(new Date(this.addPriceOfServiceGroup.get('startDate').value), 'yyyy-MM-dd'),
      endDate: this._datePipe.transform(new Date(this.addPriceOfServiceGroup.get('startDate').value), 'yyyy-MM-dd'),
      servicesId: this.addPriceOfServiceGroup.get('servicesId').value,
      type: this.addPriceOfServiceGroup.get('type').value
    }
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

  public setInputValue(controlName: string, property: string): void {
    return this._appService.setInputValue(this.addPriceOfServiceGroup, controlName, property)
  }

  public setValue(event, controlName?): void {
    if (event)
      this.addPriceOfServiceGroup.get(controlName).setValue(event);
  }

  public setTypesValue(event, controlName?): void {
    if (event) {
      this.addPriceOfServiceGroup.get(controlName).setValue(event.name)
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe()
    }
  }

}


import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../../main.service';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { AddMeasurmentModal } from '../../../main-accounting/modals';
import { MaterialValueDetail, ServerResponse, DataCount, BillingMethodPayload, IMeasurementUnitPayload } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MaterialValuesService } from '../../pages/material-values/material-values.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UnitOfMeasurementService } from '../../../main-accounting/pages/unit-of-measurement/unit-of-measurement.service';
import { MaterialValueGroupModal } from '../material-value-group/material-value-group.modal';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.modal.html',
  styleUrls: ['./classification.modal.scss']
})
export class ClassificationModal implements OnInit {
  public unitOfMeasurements: IMeasurementUnitPayload[] = [];
  public accontPlans = [];
  public materialValueGroups: MaterialValueDetail[] = [];
  public billingMethods: BillingMethodPayload[] = [];
  public classifications = [];
  public materialValues = [];
  private _subscription: Subscription;
  private _billingCount: number = 10;
  private _classificationCount = 10;
  private _billingMethodMainUrl = 'billing-methods';
  private _classificationsUrl = 'classifications';
  private _count: number = 0;
  private _accontPlansCount: number = 0;
  private _materialValueGroupsCount: number = 0;
  public errorWithServerResponce: any;
  private _image;
  public title = 'Դասակարգումներ';
  public defaultImage = '';
  public formGroup: FormGroup;
  private _modalTitle: string = 'Չափման միավոր';
  private _otherUrl: string = 'measurement-unit'
  public modalParams = { tabs: ['Կոդ', 'Չափման միավոր'], title: this._modalTitle, keys: ['id', 'unit'] };
  public modalParams1 = { tabs: ['Կոդ', 'Խումբ'], title: this._modalTitle, keys: ['id', 'name'] };
  public modalClassifications = { tabs: ['Հաշիվ', 'Անվանւմ', 'Տեսակ'], title: 'ԱՏԳԱԱ դասակարգիչ', keys: ['code', 'name', 'type'] };
  public modalAccontPlans = { tabs: ['Հաշիվ', 'Անվանւմ'], title: 'Հաշիվ', keys: ['account', 'name'] }
  // public modalBillingMethods = { tabs: ['Կոդ', 'Հապավում'], title: 'Հաշվառման մեթոդ', keys: ['id', 'abbreviation'] }



  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<ClassificationModal>,
    private _matDialog: MatDialog,
    private _mainService: MainService,
    private _appService: AppService,
    private _loadingService: LoadingService,
    private _fb: FormBuilder,
    private _materialValuesService: MaterialValuesService,
    private _unitOfMeasurementService: UnitOfMeasurementService, ) { }


  ngOnInit() {
    this._validate();
    this.checkMatDialogData();

  }

  private checkMatDialogData() {

    if (this._data.item) {
      console.log(this._data.item);


      this.formGroup.patchValue({
        accountId: this._data.item.account,
        barCode: this._data.item.barCode,
        // billingMethodId: this._data.item.billingMethod,
        characteristic: this._data.item.characteristic,
        classificationId: this._data.item.classification,
        externalCode: this._data.item.externalCode,
        hcbCoefficient: this._data.item.hcbCoefficient,
        // isAah: this._data.item.isAah,
        materialValueGroupId: this._data.item.materialValueGroup,
        measurementUnitId: this._data.item.measurementUnit,
        name: this._data.item.name,
        retailRevenueAccountId: this._data.item.retailRevenue,
        salesExpenseAccountId: this._data.item.salesExpense,
        retailerPrice: this._data.item.retailerPrice,
        salesRevenueAccountId: this._data.item.salesRevenue,
        wholesalePrice: this._data.item.wholesalePrice
      })
    }
  }

  public changeImage(event): void {
    if (event) {
      const reader = new FileReader();
      this._image = event;
      reader.onload = (e: any) => {
        this.defaultImage = 'url(' + e.target.result + ')';
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  public close() {
    this._dialogRef.close()
  }

  public openModal(isNew: boolean, key: string) {
    let modalName;
    let url: string;
    if (key == 'meansurment') {
      modalName = AddMeasurmentModal;
      url = this._otherUrl
    } else {
      if (key == 'group') {
        modalName = MaterialValueGroupModal;
        url = 'material-value-group'
      }
    }
    let dialog = this._matDialog.open(modalName, {
      width: '500px',
      maxHeight: '85vh',
      data: {
        title: this._modalTitle, url: url, array: this.materialValueGroups
      }
    })
    dialog.afterClosed().subscribe((data) => {
      if (data) {
        if (key == 'meansurment') {
          this._getMeasurementsPlanCount().subscribe()
        } else {
          if (key == 'group') {
            this._getMaterialValueGroupsCount().subscribe()
          }
        }
      }
    })
  }

  private _validate() {
    this.formGroup = this._fb.group({
      name: [null, Validators.required],
      measurementUnitId: [null, Validators.required],
      materialValueGroupId: [null, Validators.required],
      classificationId: [null, Validators.required],

      accountId: [null, Validators.required],
      salesRevenueAccountId: [null, Validators.required],
      retailRevenueAccountId: [null, Validators.required],
      salesExpenseAccountId: [null, Validators.required],

      wholesalePrice: [null, Validators.required],
      retailerPrice: [null, Validators.required],
      characteristic: [null, Validators.required],
      barCode: [null, Validators.required],
      externalCode: [null, Validators.required],
      hcbCoefficient: [null, Validators.required],
      // billingMethodId: [null, Validators.required],
      // isAah: [false, Validators.required],
    })
    this._combineObservable()
  }
  private _combineObservable() {
    const combine = forkJoin(
      this._getAccontPlansCount(),
      this._getMaterialValueGroupsCount(),
      this._getBillingMethodCount(),
      this.getClassificationsCount(),
      this._getMeasurementsPlanCount()
    )
    this._subscription = combine.subscribe()
  }

  private _getAccontPlansCount(): Observable<void> {
    return this._materialValuesService.getAccountPlansCount().pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        this._accontPlansCount = data.data.count;
        return this._getAcountPlans(this._accontPlansCount, 0)
      })
    )
  }

  private _getAcountPlans(limit: number, offset: number): Observable<void> {
    return this._materialValuesService.getAccountPlans(limit, offset).pipe(
      map((data: any) => {
        this.accontPlans = data.data
      })
    )
  }

  private _getMaterialValueGroupsCount(): Observable<void> {
    return this._materialValuesService.getMaterialValueGroupsCount().pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        this._materialValueGroupsCount = data.data.count;
        return this._getMaterialValueGroup(this._materialValueGroupsCount, 0)
      })
    )
  }

  private _getMaterialValueGroup(limit: number, offset: number = 0): Observable<void> {
    return this._materialValuesService.getMaterialValueGroup(limit, offset).pipe(
      map((data: any) => {
        this.materialValueGroups = data.data
      })
    )
  }

  private _getBillingMethodCount(): Observable<void> {
    return this._mainService.getCount(this._billingMethodMainUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        this._billingCount = data.data.count;
        return this._getBillingMethods(this._billingCount, 0)
      })
    )
  }

  private _getBillingMethods(limit: number, offset: number): Observable<void> {
    return this._mainService.getByUrl(this._billingMethodMainUrl, limit, offset).pipe(
      map((data: ServerResponse<BillingMethodPayload[]>) => {
        this.billingMethods = data.data;
      })
    )
  }


  private getClassificationsCount(): Observable<void> {
    return this._mainService.getCount(this._classificationsUrl).pipe(
      switchMap((data: ServerResponse<DataCount>) => {
        this._classificationCount = data.data.count;
        return this.getClassifications(this._classificationCount, 0)
      })
    )
  }

  private getClassifications(limit: number, offset: number): Observable<void> {
    return this._mainService.getByUrl(this._classificationsUrl, limit, offset).pipe(
      map((data: any) => {
        this.classifications = data.data;
      })
    )
  }

  private _getMeasurementsPlan(limit: number, offset: number): Observable<void> {
    return this._unitOfMeasurementService.getMeasurement(limit, offset).pipe(
      map((data: ServerResponse<IMeasurementUnitPayload[]>) => {
        this.unitOfMeasurements = data.data;
      })
    )
  }

  private _getMeasurementsPlanCount(): Observable<void> {
    return this._unitOfMeasurementService.getMeasurementsCount().pipe(
      switchMap((data: any) => {
        this._count = data.data.count;
        return this._getMeasurementsPlan(this._count, 0)

      })
    )
  }

  public setValue(event, controlName: string): void {
    this.formGroup.get(controlName).setValue(event);
  }

  public getBooleanVariable(variable: number): boolean {
    return variable == 1 ? true : false
  }

  public addClassification(): void {

    let sendingData = {
      accountId: this._appService.checkProperty(this.formGroup.get('accountId').value, 'id'),
      barCode: this.formGroup.get('barCode').value,
      // billingMethodId: this._appService.checkProperty(this.formGroup.get('billingMethodId').value, 'id'),
      characteristic: this.formGroup.get('characteristic').value,
      classificationId: this._appService.checkProperty(this.formGroup.get('classificationId').value, 'id'),
      externalCode: this.formGroup.get('externalCode').value,
      hcbCoefficient: this.formGroup.get('hcbCoefficient').value,
      // isAah: this._appService.getBooleanVariable(+this.formGroup.get('isAah').value),            //  TODO
      materialValueGroupId: this._appService.checkProperty(this.formGroup.get('materialValueGroupId').value, 'id'),
      measurementUnitId: this._appService.checkProperty(this.formGroup.get('measurementUnitId').value, 'id'),
      name: this.formGroup.get('name').value,
      retailRevenueAccountId: this._appService.checkProperty(this.formGroup.get('retailRevenueAccountId').value, 'id'),
      salesExpenseAccountId: this._appService.checkProperty(this.formGroup.get('salesExpenseAccountId').value, 'id'),
      retailerPrice: this.formGroup.get('retailerPrice').value,
      salesRevenueAccountId: this._appService.checkProperty(this.formGroup.get('salesExpenseAccountId').value, 'id'),
      wholesalePrice: this.formGroup.get('wholesalePrice').value
    };
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

  public setInputValue(controlName: string, property: string) {
    return this._appService.setInputValue(this.formGroup, controlName, property)
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }
}

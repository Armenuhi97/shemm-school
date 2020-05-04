import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { ServicesService } from '../../pages/services/services.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponse, DataCount, IMeasurementUnitPayload, AccountPlans, ClassificationDetail, ServicesDetail, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';

@Component({
    selector: 'add-service-modal',
    templateUrl: 'add-service.modal.html',
    styleUrls: ['add-service.modal.scss']
})
export class AddServiceModal {
    public title: string = 'Ծառայություն';
    public serviceGroup: FormGroup;
    public measurementUnit: IMeasurementUnitPayload[] = [];
    public accontPlans: AccountPlans[] = []
    public classifications: ClassificationDetail[] = [];
    public errorFromServerResponce: string = '';

    private _count = 0;
    private _subscription: Subscription;
    private _classificationsUrl = 'classifications';
    private _accuntPlansUrl = 'account-plans';
    private _classificationCount = 10;
    private _accontPlansCount = 10;

    private _modalTitle: string = 'Ծառայություններ';
    public modalParams = { tabs: ['Կոդ', 'Չափման միավոր'], title: this._modalTitle, keys: ['id', 'unit'] };
    public modalClassifications = { tabs: ['Կոդ', 'Անվանում', 'Չափման միավոր'], title: 'ԱՏԳԱԱ դասակարգիչ', keys: ['id', 'name', 'code'] };
    public modalParamsAccountPlans = { tabs: ['Կոդ', 'Անվանում'], title: 'Հաշիվ', keys: ['account', 'name'] }


    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: { title: string, url: string, id?: number, item?: ServicesDetail },
        private _dialogRef: MatDialogRef<AddServiceModal>,
        private _fb: FormBuilder,
        private _appService: AppService,
        private _servicesService: ServicesService,
        private _mainService: MainService,
        private _loadingService:LoadingService
        ) { }

    ngOnInit() {
        this._validate();
        this._checkMatdialogDate();
    }

    private _checkMatdialogDate(): void {
        if (this._data.item) {
            const serviceForm = this._data.item;
            console.log(serviceForm);
            
            this.serviceGroup.patchValue({
                code: serviceForm.code,
                name: serviceForm.name,
                fullName: serviceForm.fullName,
                measurementUnitId: serviceForm.measurementUnit , 
                classificationId: serviceForm.classification,
                accountId: serviceForm.account,  // TODO
                wholesalePrice: serviceForm.wholesalePrice,
                retailerPrice: serviceForm.retailerPrice,
                barCode: serviceForm.barCode,
                isAah: (typeof serviceForm.isAah === 'number') ? this.getBooleanVariable(serviceForm.isAah) : serviceForm.isAah
            })
        }else{
            this._generateDocumentNumber()
        }
    }
    private _generateDocumentNumber(): void {
        this._loadingService.showLoading()
        this._mainService.generateField('services', 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.serviceGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })
    }
    public close() {
        this._dialogRef.close()
    }

    private _combineObservable(): void {
        const combine = forkJoin(
            this._getMeasurementsUnitCount(),
            this.getClassificationsCount(),
            this._getAccontPlansCount()
        )
        this._subscription = combine.subscribe()
    }

    private _validate() {
        this.serviceGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            fullName: [null],
            measurementUnitId: [null, Validators.required],
            classificationId: [null, Validators.required],
            accountId: [null],
            wholesalePrice: [null],
            retailerPrice: [null, Validators.required],
            barCode: [null, Validators.required],
            isAah: [false]
        })
        this._combineObservable()
    }

    private _getMeasurementsUnit(limit: number, offset: number): Observable<ServerResponse<IMeasurementUnitPayload[]>> {
        return this._servicesService.getMeasurementUnit(limit, offset).pipe(
            map((data: ServerResponse<IMeasurementUnitPayload[]>) => {
                this.measurementUnit = data.data;
                return data
            })
        )
    }
    private _getMeasurementsUnitCount(): Observable<ServerResponse<DataCount>> {
        return this._servicesService.getMeasurementsUnitCount().pipe(
            map((data: ServerResponse<DataCount>) => {
                this._count = data.data.count;
                this._getMeasurementsUnit(this._count, 0).subscribe()
                return data
            })
        )
    }


    private getClassifications(limit: number, offset: number): Observable<ServerResponse<ClassificationDetail[]>> {
        return this._mainService.getByUrl(this._classificationsUrl, limit, offset).pipe(
            map((data: ServerResponse<ClassificationDetail[]>) => {
                this.classifications = data.data;
                return data
            })
        )
    }
    private getClassificationsCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._classificationsUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._classificationCount = data.data.count;
                this.getClassifications(this._classificationCount, 0).subscribe()
                return data
            })
        )
    }


    private _getAcountPlans(limit: number, offset: number): Observable<ServerResponse<AccountPlans[]>> {
        return this._mainService.getByUrl(this._accuntPlansUrl, limit, offset).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.accontPlans = data.data
                return data
            })
        )
    }
    private _getAccontPlansCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount(this._accuntPlansUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                this._accontPlansCount = data.data.count;
                this._getAcountPlans(this._accontPlansCount, 0).subscribe()
                return data
            })
        )
    }


    public addService(): void {
        let sendingData: ServicesDetail = {
            code: this.serviceGroup.get('code').value,
            name: this.serviceGroup.get('name').value,
            fullName: this.serviceGroup.get('fullName').value,
            measurementUnitId: this._appService.checkProperty(this.serviceGroup.get('measurementUnitId').value, 'id'),
            classificationId: this._appService.checkProperty(this.serviceGroup.get('classificationId').value, 'id'),
            accountId: this._appService.checkProperty(this.serviceGroup.get('accountId').value, 'account'),       //  TODO bdi server ubdate exnvi "account"
            wholesalePrice: this.serviceGroup.get('wholesalePrice').value,
            retailerPrice: this.serviceGroup.get('retailerPrice').value,
            barCode: this.serviceGroup.get('barCode').value,
            isAah: this.serviceGroup.get('isAah').value
        };
        if (this._data.id && this._data.item) {
            this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
                .subscribe(
                    (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                    (error) => {
                        this.errorFromServerResponce = error.error.message
                    }
                )
        } else {
            this._mainService.addByUrl(`${this._data.url}`, sendingData)
                .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                    (error) => {
                        this.errorFromServerResponce = error.error.message
                    }
                )
        }
    }

    public getBooleanVariable(variable: number): boolean {
        return this._appService.getBooleanVariable(variable)
    }

    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.serviceGroup, controlName, property)
    }

    public setValue(event, controlName?): void {
            this.serviceGroup.get(controlName).setValue(event);
    }


    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe()
        }
    }

}
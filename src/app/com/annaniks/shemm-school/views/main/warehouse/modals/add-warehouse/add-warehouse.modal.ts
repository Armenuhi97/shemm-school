import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { IWarehouseDetail, ServerResponse, DataCount, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'add-warehouse-modal',
    templateUrl: 'add-warehouse.modal.html',
    styleUrls: ['add-warehouse.modal.scss']
})
export class AddWarehouseModal {
    public formGroup: FormGroup;
    public warehouseModalParams = { tabs: ['Կոդ', 'Անվանւմ'], title: 'Հաշիվ', keys: ['id', 'name'] }

    private _subscription: Subscription;
    public title: string;
    public wareHouseAcquistions = []
    public errorWithServerResponce: string = '';
    constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<AddWarehouseModal>,
        private _mainService: MainService,
        private _fb: FormBuilder,
        private _appService: AppService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
    }

    ngOnInit() {
        this._validate();
        this.checkMatDialogData();
    }

    private checkMatDialogData() {
        if (this._data.item) {
            const { name, code, address, responsible } = this._data.item
            this.formGroup.setValue({
                name,
                code,
                address,
                responsible,
                //  warehouseSignificance
            })
        } else {
            this._generateCode()
        }
    }

    public close() {
        this._dialogRef.close()
    }
    // private _combineObservable() {
    //     this._loadingService.showLoading()
    //     const combine = forkJoin(
    //         this._getWareHouseAcquistionCount()
    //     )
    //     this._subscription = combine.subscribe(()=>this._loadingService.hideLoading())
    // }
    private _generateCode(): void {
        this._mainService.generateField(this._data.url, 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.formGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        },
            () => {
                this._loadingService.hideLoading()
            })
    }

    // private _getWareHouseAcquistionCount(): Observable<void> {
    //     return this._mainService.getCount(this._urls.warehouseSignificancesMainUrl).pipe(
    //         switchMap((data: ServerResponse<DataCount>) => {
    //             return this._getWareHouseAcquistion(data.data.count)
    //         })
    //     )
    // }
    // private _getWareHouseAcquistion(count: number): Observable<void> {
    //     return this._mainService.getByUrl(this._urls.warehouseSignificancesMainUrl, count, 0).pipe(
    //         map((data: ServerResponse<any[]>) => {
    //             this.wareHouseAcquistions = data.data;
    //         })
    //     )
    // }
    private _validate() {
        this.formGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            responsible: [null, Validators.required],
            address: [null, Validators.required],
            // warehouseSignificance: [null, Validators.required]
        })
        // this._combineObservable()
    }

    public addWarehouse() {
        let sendingData: IWarehouseDetail = {
            code: this.formGroup.get('code').value,
            name: this.formGroup.get('name').value,
            responsible: this.formGroup.get('responsible').value,
            address: this.formGroup.get('address').value,
            // warehouseSignificanceId: this._appService.checkProperty(this.formGroup.get('warehouseSignificance').value, 'id'),
        }

        this._loadingService.showLoading()
        if (this._data.id && this._data.item) {
            this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
                .subscribe(
                    (data) => {
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true, id: this._data.id })
                    },
                    (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    }
                )
        } else {
            this._mainService.addByUrl(`${this._data.url}`, sendingData)
                .subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                    this._loadingService.hideLoading()
                },
                    (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
        }
    }
    public setValue(event, controlName) {
        this.formGroup.get(controlName).setValue(event);
        this.onFocus(this.formGroup, controlName)

    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.formGroup, controlName, property)
    }
    ngOndestroy() {
        this._subscription.unsubscribe();
        this._loadingService.hideLoading()
    }
}

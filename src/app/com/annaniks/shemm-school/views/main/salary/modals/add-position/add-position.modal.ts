import { Component, Inject } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { ServerResponse, ShortModel, DataCount, ModalDataModel, PositionModel, JsonObjectType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-position-modal',
    templateUrl: 'add-position.modal.html',
    styleUrls: ['add-position.modal.scss']
})
export class AddPositionModal {
    public formGroup: FormGroup;
    public title: string;
    public calculateSalaryArray: JsonObjectType[] = []

    private _error: string;
    private _subdivisions: ShortModel[] = [];
    private _subscription: Subscription;
    public modalParams = {
        tabs: ['Անվանում'], title: 'Ստորաբաժանում', keys: ['name']
    }
    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<AddPositionModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _appService: AppService,
        private _messageService: MessageService,

        @Inject('URL_NAMES') private _urls
    ) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate();
    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getCount(),
            this._mainService.getSalaryType()
        )
        this._subscription = combine.subscribe((data) => {
            this.calculateSalaryArray = this._oftenUsedParamsService.getSalaryType()
            if (data) {
                this._getById()
            }
        }
        )
    }

    private _getCount(): Observable<void> {
        return this._mainService.getCount(this._urls.subdivisionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                let count = data.data.count;
                return this._getSubvision(count)
            })
        )
    }
    private _getSubvision(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.subdivisionMainUrl, count, 0).pipe(
            map((data: ServerResponse<ShortModel[]>) => {
                this._subdivisions = data.data;
            })
        )
    }

    private _getById() {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<PositionModel>) => {
                if (data) {
                    this.formGroup.patchValue({
                        name: data.data.name,
                        subdivisions: this._appService.checkProperty(this._appService.filterArray(this._subdivisions, data.data.subdivisionId, 'id'), 0),
                        calculateTypeOfSalary: this._appService.checkProperty(this._appService.filterArray(this.calculateSalaryArray, +data.data.methodOfSallaryCalculation, 'id'), 0),
                    })
                }
                this._loadingService.hideLoading()
            },
            )
        } else {
            this._loadingService.hideLoading()
        }
    }

    public close(): void {
        this._dialogRef.close()
    }
    private _validate(): void {
        this.formGroup = this._fb.group({
            name: [null, Validators.required],
            subdivisions: [null, Validators.required],
            calculateTypeOfSalary: [null, Validators.required]
        })
        this._combineObservable()
    }
    public add(): void {
        this._appService.markFormGroupTouched(this.formGroup)

        if (this.formGroup.valid) {
            this._loadingService.showLoading();
            let sendObject = {
                name: this.formGroup.get('name').value,
                subdivisionId: this.formGroup.get('subdivisions').value.id,
                methodOfSallaryCalculation: this._appService.checkProperty(this.formGroup.get('calculateTypeOfSalary').value, 'name')

            }
            if (!this._data.id) {
                this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                    this._loadingService.hideLoading()
                    this._dialogRef.close({ value: true })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            } else {
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe((data) => {
                    this._loadingService.hideLoading()
                    this._dialogRef.close({ value: true, id: this._data.id })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            }
        }

    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setValue(event, controlName: string): void {
        this.formGroup.get(controlName).setValue(event);
        this.onFocus(this.formGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.formGroup, controlName, property)
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()

        this._subscription.unsubscribe()
    }
    get subdivisions(): ShortModel[] {
        return this._subdivisions
    }
    get error(): string {
        return this._error
    }
}
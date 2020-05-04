import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServerResponse, ShortModel, ModalDataModel } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-unit-modal',
    templateUrl: 'add-unit.modal.html',
    styleUrls: ['add-unit.modal.scss']
})
export class AddUnitModal {
    public formGroup: FormGroup;
    public title: string;
    private _error: string
    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<AddUnitModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,

    ) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate();

    }
    public getById(): void {
        if (this._data.id) {
            this._loadingService.showLoading()
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<ShortModel>) => {
                if (data) {
                    this.formGroup.patchValue({
                        name: data.data.name
                    })
                }
                this._loadingService.hideLoading()
            }
                // , () => { this._loadingService.hideLoading() }
            )
        }

    }
    public close(): void {
        this._dialogRef.close()
    }
    private _validate(): void {
        this.formGroup = this._fb.group({
            name: [null, Validators.required]
        })
        this.getById()
    }
    public add(): void {
        if (this._data.url) {
            if (this.formGroup.valid) {
                this._loadingService.showLoading()
                if (!this._data.id) {
                    this._mainService.addByUrl(this._data.url, { name: this.formGroup.get('name').value }).subscribe((data) => {
                        this._dialogRef.close({ value: true })
                        this._loadingService.hideLoading()
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                } else {
                    this._mainService.updateByUrl(this._data.url, this._data.id, { name: this.formGroup.get('name').value }).subscribe((data) => {
                        this._dialogRef.close({ value: true, id: this._data.id });
                        this._loadingService.hideLoading()
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                }
            }
        }

    }
    get error(): string {
        return this._error
    }
}
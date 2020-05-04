import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, Types, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
    selector: 'add-types',
    templateUrl: 'add-types.modal.html',
    styleUrls: ['add-types.modal.scss']
})
export class AddTypesModal {
    public typesGroup: FormGroup;
    public title: string;
    private _error: string
    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<AddTypesModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate();
    }

    private _getSubsectionById() {
        if (this._data.id) {
            this._loadingService.showLoading()
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<Types>) => {
                if (data) {
                    this.typesGroup.patchValue({
                        code: data.data.code,
                        name: data.data.name
                    })                    
                }
                this._loadingService.hideLoading()
            })
        } else {
            this._generateDocumentNumber()
        }
    }
    private _generateDocumentNumber(): void {
        this._loadingService.showLoading()
        this._mainService.generateField('type-of-action', 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.typesGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        },
            () => { this._loadingService.hideLoading() })
    }
    public close() {
        this._dialogRef.close()
    }
    private _validate() {
        this.typesGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required]
        })
        this._getSubsectionById()
    }
    public addTypes() {
        if (this._data.url) {
            this._appService.markFormGroupTouched(this.typesGroup)
            if (this.typesGroup.valid) {
                this._loadingService.showLoading()
                let sendObject = {
                    name: this.typesGroup.get('name').value,
                    code: this.typesGroup.get('code').value
                }
                if (!this._data.id) {
                    this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                        this._error = '';
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true })
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                } else {
                    this._mainService.updateByUrl(this._data.url, this._data.id, sendObject
                    ).subscribe((data) => {
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true, id: this._data.id })
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                }
            }
        }
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()

    }
    get error(): string {
        return this._error
    }
}
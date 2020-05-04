import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'classifier-modal',
    templateUrl: 'classifier.modal.html',
    styleUrls: ['classifier.modal.scss']
})
export class ClassifierModal {
    public classifierGroup: FormGroup;
    public title: string;
    private _error: string;
    public types: Array<{ name: string, code: number, key: string }> = [{ name: 'Նյութական արժեք', code: 1, key: 'ԱՏԳԱԱ' }, { name: 'Ծառայություն', code: 2, key: 'ԱԴԳՏ' }];
    public modalParams = { tabs: ['Կոդ', 'Անվանում'], title: 'Տեսակ', keys: ['code', 'name'] }

    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<ClassifierModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate();
    }

    private _getSubsectionById(): void {
        if (this._data.id) {
            this._loadingService.showLoading()
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<any>) => {
                if (data) {
                    this.classifierGroup.patchValue({
                        code: data.data.code,
                        name: data.data.name,
                        type: this._appService.checkProperty(this._appService.filterArray(this.types,
                            data.data.type, 'key'), 0)
                    })
                    this._loadingService.hideLoading()
                }
            })
        }else{
            this._generateDocumentNumber()
        }

    }
    private _generateDocumentNumber(): void {
        this._loadingService.showLoading()
        this._mainService.generateField(this._data.url, 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.classifierGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        },
            () => { this._loadingService.hideLoading() })
    }
    public close(): void {
        this._dialogRef.close()
    }
    private _validate(): void {
        this.classifierGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            type: [null, Validators.required]
        })
        this._getSubsectionById()
    }
    public addClassifier(): void {
        if (this._data.url) {
            this._appService.markFormGroupTouched(this.classifierGroup)
            if (this.classifierGroup.valid) {
                this._loadingService.showLoading()
                let sendObject = {
                    name: this.classifierGroup.get('name').value,
                    code: this.classifierGroup.get('code').value,
                    type: this.classifierGroup.get('type').value.key
                }
                if (!this._data.id) {
                    this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                        this._error = '';
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true });
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
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setValue(event): void {
        this.classifierGroup.get('type').setValue(event);
        this.onFocus(this.classifierGroup, 'type')

    }
    public setInputValue(item, controlName: string, property: string) {
        return this._appService.setInputValue(item, controlName, property)
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()

    }
    get error() {
        return this._error
    }
}
import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { MessageService } from 'primeng/api/';
import { ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
    selector: 'add-bank-modal',
    templateUrl: 'add-bank.modal.html',
    styleUrls: ['add-bank.modal.scss']
})
export class AddBank {
    public title: string = "Բանկ";
    public bankGroup: FormGroup;
    private _error: string = '';
    constructor(
        private _dialogRef: MatDialogRef<AddBank>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,

        private _fb: FormBuilder) { }

    ngOnInit() {
        this._validate();
        this._chackBankKeys()
    }
    private _validate() {
        this.bankGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            swift: [null]
        })
    }
    public close(): void {
        this._dialogRef.close()
    }
    private _chackBankKeys() {
        if (this._data.item) {
            const { code, name, swift } = this._data.item
            this.bankGroup.patchValue({
                code, name, swift
            })
        }else{
            this._generateDocumentNumber()
        }

    }

    private _generateDocumentNumber(): void {
        this._loadingService.showLoading()
        this._mainService.generateField(this._data.url, 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.bankGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })
    }
    public addBank() {
        let sendObject = this.bankGroup.value
        if (this._data.id && this) {
            this._mainService.updateByUrl(this._data.url, this._data.id, sendObject)
                .subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
        } else {
            this._mainService.addByUrl(this._data.url, sendObject)
                .subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
        }
    }

    get error(): string {
        return this._error
    }
}
import { Component, Inject } from "@angular/core";
import { AppService } from '../../services';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'select-document-type-modal',
    templateUrl: 'select-document-type.modal.html',
    styleUrls: ['select-document-type.modal.scss']
})
export class SelectDocumentTypeModal {
    public array = [];
    public error: string = ''
    private _firsText = "Համաձայն N ... պայմանագրի";
    private _secondText = "N ... փաստաթղթի համաձայն"
    public folderNumber1 = new FormControl(null);
    public folderNumber2 = new FormControl(null)

    public folderType = new FormControl(null, Validators.required)
    constructor(private _dialogRef: MatDialogRef<SelectDocumentTypeModal>,
        private _appService: AppService,
        @Inject(MAT_DIALOG_DATA) private _data: { array: any, params: { tabs: string[], title: string, keys: [], }, select: Object, inputValue: any, selectObjectId: any, property: string }) {
    }

    public close() {
        this._dialogRef.close()
    }
    public save() {
        this.error=''
        let selectedType = ''
        if (this.folderType.value == 1) {
            if (this.folderNumber1.value) {
                selectedType = this._firsText.replace("...", this.folderNumber1.value);
                this.error = ''
            } else {
                this.error = 'Լրացրեք պայմանագրի համարը'
            }
        } else {
            if (this.folderType.value == 2) {
                if (this.folderNumber2.value) {
                    selectedType = this._secondText.replace("...", this.folderNumber2.value)
                } else {
                    this.error = 'Լրացրեք փաստաթղթի համարը'
                }
            }
        }
        if (selectedType)
            this._dialogRef.close(selectedType)
    }
}

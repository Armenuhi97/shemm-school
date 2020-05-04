import { Component, Inject } from "@angular/core";
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'date-lis-modal',
    templateUrl: 'date-list.modal.html',
    styleUrls: ['date-list.modal.scss']
})
export class DateListModal {
    public title: string="Ամսաթվեր";

    constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<DateListModal>) { }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
}
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './memorable-orders.modal.html',
    styleUrls: ['./memorable-orders.modal.scss']
})
export class MemorableOrdersModal implements OnInit {


    public formGroup: FormGroup;
    public title = 'Ստորաբաժանում (Նոր)';
    constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _dialogRef: MatDialogRef<MemorableOrdersModal>,
        private _fb: FormBuilder) { }

    ngOnInit() {
        this._validate()
    }

    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }

    private _validate() {
        this.formGroup = this._fb.group({
        })
    }

}

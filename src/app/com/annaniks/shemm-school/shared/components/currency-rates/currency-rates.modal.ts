import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-currency-rates',
    templateUrl: './currency-rates.modal.html',
    styleUrls: ['./currency-rates.modal.scss']
})
export class CurrencyRatesModal implements OnInit {

    public formGroup: FormGroup;
    public title = 'Արտարժույթի փոխարժեքներ';

    constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _dialogRef: MatDialogRef<CurrencyRatesModal>,
        private _fb: FormBuilder) { }

    ngOnInit() {
        this._validate()
    }

    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
    public execute() { }
    private _validate() {
        this.formGroup = this._fb.group({
        })
    }

}

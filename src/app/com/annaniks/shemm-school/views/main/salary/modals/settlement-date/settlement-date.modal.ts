import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'settlement-date-modal',
    templateUrl: 'settlement-date.modal.html',
    styleUrls: ['settlement-date.modal.scss']
})
export class SettlementDateModal {
    public title: string
    constructor(private _dialogRef: MatDialogRef<SettlementDateModal>,
        @Inject(MAT_DIALOG_DATA) private _date: { label: string, type: number },
        @Inject('CALENDAR_CONFIG') public calendarConfig) { }
    ngOnInit() {
        this.title = this._date.label;
    }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
}
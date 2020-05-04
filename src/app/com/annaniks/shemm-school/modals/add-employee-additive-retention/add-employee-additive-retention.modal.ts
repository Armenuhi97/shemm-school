import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'additive-retention-modal',
    templateUrl: 'add-employee-additive-retention.modal.html',
    styleUrls: ['add-employee-additive-retention.modal.scss']
})
export class AddEmployeeAdditiveRetention {
    public title: string
    constructor(private _dialogRef: MatDialogRef<AddEmployeeAdditiveRetention>,
        // @Inject(MAT_DIALOG_DATA) private _date: { label: string, type: number },
        @Inject('CALENDAR_CONFIG') public calendarConfig) { }
    ngOnInit() {
        this.title = 'Հավելում/պահումներ';
    }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
}
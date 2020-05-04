import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectEmployeeModal } from '../select-employees/select-employees.modal';
import { AppService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
    selector: 'short-data-modal',
    templateUrl: 'short-data.modal.html',
    styleUrls: ['short-data.modal.scss']
})
export class ShortDataModal {
    public shortDataGroup: FormGroup;
    public title: string;
    constructor(
        private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _dialogRef: MatDialogRef<ShortDataModal>,
        @Inject(MAT_DIALOG_DATA) private _date,
        private _appService:AppService) {
        this.title = this._date.label
    }
    ngOnInit() {
        this._validate()
    }
    public close(event) {
        this._dialogRef.close()
    }
    private _validate() {
        this.shortDataGroup = this._fb.group({
            startDate: [null],
            endDate: [null],
            employee: [null],
            unit: [null]
        })
    }
    public setYearRange(){
        return this._appService.setYearRange()
    }
    public setBenefitValue(event, controlName: string, attributeName: string) {
        if (event)
            this.shortDataGroup.get(controlName).setValue(event[attributeName]);
    }
    get getModalName() {
        return SelectEmployeeModal
    }

}
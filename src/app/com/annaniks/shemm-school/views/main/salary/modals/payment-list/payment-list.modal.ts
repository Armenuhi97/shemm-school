import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectEmployeeModal } from '../select-employees/select-employees.modal';
import { AppService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
    selector: 'payment-list-modal',
    templateUrl: 'payment-list.modal.html',
    styleUrls: ['payment-list.modal.scss']
})
export class PaymentListModal {
    public title: string;
    public paymentListGroup: FormGroup
    constructor(private _dialogRef: MatDialogRef<PaymentListModal>,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject(MAT_DIALOG_DATA) private _date,
        private _fb: FormBuilder,
        private _appService:AppService) {
        this.title = this._date.label
    }
    ngOnInit() {
        this._validate()
    }
    private _validate() {
        this.paymentListGroup = this._fb.group({
            date: [null, Validators.required],
            employee: [null],
            unit: [null],
            isShowTimes: [false],
            isExtended: [false]
        })
    }
    public setEmployeeValue(event) {
        if (event)
            this.paymentListGroup.get('employee').setValue(event.name);
    }
    public setYearRange(){
        return this._appService.setYearRange()
    }
    get getModalName() {
        return SelectEmployeeModal
    }
    close() {
        this._dialogRef.close()
    }

}
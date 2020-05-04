import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectEmployeeModal } from '../select-employees/select-employees.modal';
import { SelectDocumentModal } from '../select-document/select-document.modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'salary-documents-journal-modal',
    templateUrl: 'salary-documents-journal.modal.html',
    styleUrls: ['salary-documents-journal.modal.scss']
})
export class SalaryDocumentJournalModal {
    public salaryDocumentGroup: FormGroup;
    public title:string;
    constructor(
        private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _dialogRef: MatDialogRef<SalaryDocumentJournalModal>,
        @Inject(MAT_DIALOG_DATA) private _date) {
            this.title=this._date.label
         }
    ngOnInit() {
        this._validate()
    }
    public close(event){
        this._dialogRef.close()
    }
    private _validate() {
        this.salaryDocumentGroup = this._fb.group({
            startDate: [null],
            endDate: [null],
            type: [null],
            employee: [null],
            condition: [null],
            allowOperation: [null]
        })
    }
    public setBenefitValue(event, controlName:string,attributeName:string) {
        if (event)
            this.salaryDocumentGroup.get(controlName).setValue(event[attributeName]);
    }
    get getModalName2() {
        return SelectEmployeeModal
    }
    get getModalName1() {
        return SelectDocumentModal
    }
}
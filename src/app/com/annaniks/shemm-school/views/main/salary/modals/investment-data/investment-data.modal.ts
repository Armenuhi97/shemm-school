import { Component, Inject } from "@angular/core";
import { SelectEmployeeModal } from '../select-employees/select-employees.modal';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'investment-data-modal',
    templateUrl: 'investment-data.modal.html',
    styleUrls: ['investment-data.modal.scss']
})
export class InvestmentDataModal {
    private _activeTab: string;
    public title: string;
    public investmentDataGroup: FormGroup;
    public isFocus:boolean=false;
    public tabsItem: string[] = ['Միջին աշխատավարձի տվյալներ', 'Արձակուրդայինի տվյալներ', 'Մայրության նպաստի տվյալներ']
    constructor(private _dialogRef: MatDialogRef<InvestmentDataModal>,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject(MAT_DIALOG_DATA) private _date,
        private _fb: FormBuilder) { }

    ngOnInit() {
        this.title = this._date.label;
        this._validate()

    }

    public close(event) {
        if (event)
            this._dialogRef.close()
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }

    private _validate() {
        this.investmentDataGroup = this._fb.group({
            date: [null, Validators.required],
            folderNumber: [null, Validators.required],
            employee: [null, Validators.required],
            beginningMonthDebt:[null],
            analyticalGroup1: [null, Validators.required],
            analyticalGroup2: [null, Validators.required],
            comment: [null]
        })
    }
    public getActiveTab(event) {
        this._activeTab = event

    }
    public setEmployeeValue(event) {
        if (event)
            this.investmentDataGroup.get('employee').setValue(event.name);
    }
    get getModalName() {
        return SelectEmployeeModal
    }
    get activeTab(): string {
        return this._activeTab
    }
}
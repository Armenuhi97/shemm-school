import { Component, Inject } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectAdditionRetentionModal } from '../select-addition-retention/select-addition-retention.modal';

@Component({
    selector: 'app-confirm-addition-retention',
    templateUrl: 'confirm-addition-retention.modal.html',
    styleUrls: ['confirm-addition-retention.modal.scss']
})
export class ConfirmAdditionRetentionModal {
    public title: string;
    public listArray: FormArray;
    public totalAmount: number = 0;
    public confirmAdditionRetentionGroup: FormGroup;
    public isFocus: boolean=false;
    constructor(private _dialogRef: MatDialogRef<ConfirmAdditionRetentionModal>,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject(MAT_DIALOG_DATA) private _date,
        private _fb: FormBuilder) { }

    ngOnInit() {
        this.title = this._date.label;
        this._validate();
        this._validateTable()
    }

    public close(event) {
        if (event)
            this._dialogRef.close()
    }
    private _validate() {
        this.confirmAdditionRetentionGroup = this._fb.group({
            date: [null, Validators.required],
            folderNumber: [null],
            additionRetention: [null, Validators.required],
            unit: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null]
        })
    }
    private _validateTable() {
        this.listArray = this._fb.array([
            this._fb.group({
                unit: [null],
                reportCard: [null],
                name: [null],
                byHands: [null],
                paidAmount: [null]
            })
        ])
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public addRow(event: boolean) {
        if (event) {
            this.listArray.push(this._fb.group({
                unit: [null],
                reportCard: [null],
                name: [null],
                byHands: [null],
                paidAmount: [null]
            }))
        }
    }
    public remove(index: number): void {
        this.listArray.removeAt(index);
        this.changeAmount()
    }
    public deleteAll(event: boolean): void {
        if (event) {
            this.listArray = new FormArray([]);
            this.totalAmount = 0;
        }
    }
    public changeAmount() {
        let sum: number = 0
        if (this.listArray && this.listArray.controls) {
            for (let item of this.listArray.controls) {
                if (item.get('paidAmount').value) {
                    sum += (item.get('paidAmount').value) ? +item.get('paidAmount').value : 0
                }
            }
        }
        this.totalAmount = sum;
    }
    public setValue(event) {
            this.confirmAdditionRetentionGroup.get('additionRetention').setValue(event.name);
            this.onFocus(this.confirmAdditionRetentionGroup,'additionRetention')

    }
    get getModalName() {
        return SelectAdditionRetentionModal
    }

}
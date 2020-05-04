import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'operation-imported-from-file-modal',
    templateUrl: 'operation-imported-from-file.modal.html',
    styleUrls: ['operation-imported-from-file.modal.scss']
})
export class OperationImportedFromFile { 
    public title:string;
    public filesGroup:FormGroup
    constructor(private _dialogRef: MatDialogRef<OperationImportedFromFile>,
        private _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _date: { label: string },
        @Inject('CALENDAR_CONFIG') public calendarConfig) { }
        
    ngOnInit() {
        this.title = this._date.label;
        this._validate()
    }
    private _validate(){
        this.filesGroup=this._fb.group({
            startDate:[null,Validators.required],
            endDate:[null,Validators.required],
            settlement_account:[null],
            currency:[null]
        })
    }
    public close(event) {
        if (event)
            this._dialogRef.close()
    }
}
import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'material-values-T-account-modal',
    templateUrl: 'material-values-T-account.modal.html',
    styleUrls: ['material-values-T-account.modal.scss']
})
export class MaterialValuesTAccountModal {
    public title: string;
    public isAdditionally:boolean=false
    public materialValuesGroup:FormGroup
    constructor(private _dialogRef: MatDialogRef<MaterialValuesTAccountModal>,
        @Inject(MAT_DIALOG_DATA) private _data: { label: string },
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb:FormBuilder) {
        this.title = this._data.label
    }
    ngOnInit(){
        this._validate()
    }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
    private _validate(){
        this.materialValuesGroup=this._fb.group({
            startDate:[null,Validators.required],
            endDate:[null,Validators.required],
            material_cost:[null,Validators.required],
            warehouse:[null],
            account:[null],
            isShowparties:[false],
            isGroup_by_correspondent_object:[null],
            isShow_balace_at_the_end_day:[null],
            isShow_aah_amount:[null],
            code:[null,Validators.required]
        })
    }
    public openOrCloseAdditionalInfo() {
        this.isAdditionally = !this.isAdditionally
    }
    public arrowStyle() {
        let style = {}
        if (this.isAdditionally) {
            style['transform'] = "rotate(180deg)"
        }
        return style
    }
}
import { Component } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'add-typical-actions-modal',
    templateUrl: 'add-typical-actions.modal.html',
    styleUrls: ['add-typical-actions.modal.scss']
})
export class AddTypicalActionsModal {
    public title: string = "Տիպային գործողություններ";
    public typicalActionGroup: FormGroup;
    public typicalActionTableGroup: FormArray;
    constructor(private _dialogRef: MatDialogRef<AddTypicalActionsModal>,
        private _fb: FormBuilder) { }
    ngOnInit() {
        this._validate();
        this._tableValidate()
    }
    private _tableValidate() {
        this.typicalActionTableGroup = this._fb.array([
            this._fb.group({
                debit: [null],
                debit_partner: [null],
                debit_currency: [null],
                credit: [null],
                credit_partner: [null],
                money_currency: [null],
                amount_in_dram: [null],
                credit_currency: [null],
                comment: [null],
                debit_analytic1:[null],
                debit_analytic2:[null],
                credit_analytic1:[null],
                credit_analytic2:[null],

            })
        ])
    }
    public addRow(event: boolean) {
        if (event) {
            let formArray = this.typicalActionTableGroup as FormArray;
            formArray.push(this._fb.group({
                debit: [null],
                debit_partner: [null],
                debit_currency: [null],
                credit: [null],
                credit_partner: [null],
                money_currency: [null],
                amount_in_dram: [null],
                credit_currency: [null],
                comment: [null],
                debit_analytic1:[null],
                debit_analytic2:[null],
                credit_analytic1:[null],
                credit_analytic2:[null],
            }))
        }
    }
    public remove(index: number) {
        let formArray = this.typicalActionTableGroup as FormArray;
        formArray.removeAt(index)
    }
    public deleteAll(event: boolean) {
        if (event)
            this.typicalActionTableGroup = new FormArray([])
    }
    private _validate() {
        this.typicalActionGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required]
        })
    }
    public close(ev) {
        if (ev) {
            this._dialogRef.close()
        }
    }
}
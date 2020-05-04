import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
    selector: 'app-material-values-inventory-common',
    templateUrl: 'material-values-inventory-common.component.html',
    styleUrls: ['material-values-inventory-common.component.scss']
})
export class MaterialValuesInventoryCommonComponent {
    public materialValuesCommonArray: FormArray;
    public totalFactAmount: number = 0;
    public totalAmount: number = 0;
    constructor(private _fb: FormBuilder) {
        this._validate()
    }
    private _validate() {
        this.materialValuesCommonArray = this._fb.array([
            this._fb.group({
                code: [null, Validators.required],
                name: [null, Validators.required],
                point:[null, Validators.required],
                quantity: [null, Validators.required],
                fact_count: [null, Validators.required],
                deviation: [null, Validators.required],
                amount: [null, Validators.required],
                fact_amount: [null, Validators.required]
            })
        ])
    }
    public addRow(event: boolean) {
        if (event) {
            let formArray = this.materialValuesCommonArray as FormArray;
            formArray.push(this._fb.group({
                code: [null, Validators.required],
                name: [null, Validators.required],
                point:[null, Validators.required],
                quantity: [null, Validators.required],
                fact_count: [null, Validators.required],
                deviation: [null, Validators.required],
                amount: [null, Validators.required],
                fact_amount: [null, Validators.required]
            }))
        }
    }




    public remove(index: number): void {
        this.materialValuesCommonArray.removeAt(index);
        this.changeAmount();
        this.changeFactAmount()
    }
    public deleteAll(event: boolean): void {
        if (event) {
            this.materialValuesCommonArray = new FormArray([]);
            this.totalAmount = 0;
            this.totalFactAmount = 0
        }
    }

    public changeAmount() {
        let sum: number = 0
        if (this.materialValuesCommonArray && this.materialValuesCommonArray.controls) {
            for (let item of this.materialValuesCommonArray.controls) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0
                }
            }
        }
        this.totalAmount = sum
    }

    public changeFactAmount() {
        let sum: number = 0
        if (this.materialValuesCommonArray && this.materialValuesCommonArray.controls) {
            for (let item of this.materialValuesCommonArray.controls) {
                if (item.get('fact_amount').value) {
                    sum += (item.get('fact_amount').value) ? +item.get('fact_amount').value : 0
                }
            }
        }
        this.totalFactAmount = sum
    }
}
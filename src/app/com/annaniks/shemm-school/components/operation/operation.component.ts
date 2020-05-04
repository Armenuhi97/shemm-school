import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DeletedFormArrayModel, AnalyticalGroup, Partner, AccountPlans } from '../../models/global.models';
import { Subscription } from 'rxjs';
import { ComponentDataService, AppService } from '../../services';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-operation',
    templateUrl: 'operation.component.html',
    styleUrls: ['operation.component.scss']
})
export class OperationComponent {
    private _typeOperation: boolean = false;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = [];
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = [];
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    private _subscription: Subscription
    public operationFormArray: FormArray
    public totalSum: number = 0;

    @Input('isLock') public isLock: boolean
    @Output('setOperationValue') private _setValue = new EventEmitter;

    @Input('chartAccounts')
    set setChartAccount($event: AccountPlans[]) {
        this.chartAccounts = $event
    }
    @Input('partners')
    set setPartners($event: Partner[]) {
        this.partners = $event
    }
    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event: AnalyticalGroup[]) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event: AnalyticalGroup[]) {
        this.analyticalGroup2 = $event
    }
    @Input('typeOperation')
    set getIsHasTypeFilter($event: boolean) {
        this._typeOperation = $event
    }

    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.operationFormArray = this._fb.array([]);
            $event.forEach(element => {
                this.operationFormArray.push(element);
                this._appService.markFormGroupTouched(element)
            });

            this.change()
        }
    }

    constructor(private _fb: FormBuilder, private _matDialog: MatDialog, private _appService: AppService,
        private _componentDataService: ComponentDataService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.operationFormArray) {
                    let isValid = this.operationFormArray && this.operationFormArray.valid ? true : false;
                    this._componentDataService.sendData(this.operationFormArray.controls, 'operation', isValid, this._deletedGroupsArray)
                    this._deletedGroupsArray = []
                }
            }
        })
    }
    public setOperationValue($event) {
        this._setValue.emit($event)
    }
    public remove(index: number): void {
        let formArray = this.operationFormArray as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index);
        this.change()

    }
    public deleteAll(event: boolean): void {
        let formArray = this.operationFormArray as FormArray;
        if (event && formArray && formArray.length) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(index);
            this.change()

        }
    }
    private _validate(): void {
        this.operationFormArray = this._fb.array([
            //     this._fb.group({
            //     debit: [null, Validators.required],
            //     debitProcess: [null, Validators.required],
            //     debitGroup1: [null, Validators.required],
            //     debitGroup2: [null, Validators.required],
            //     credit: [null, Validators.required],
            //     creditProcess: [null, Validators.required],
            //     creditGroup1: [null, Validators.required],
            //     creditGroup2: [null, Validators.required],
            //     amountInDram: [0, Validators.required],
            //     comment: [null],
            //     id: [null]
            // })
        ])
    }

    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.operationFormArray as FormArray;
            formArray.push(this._fb.group({
                debit: [null],
                debitProcess: [null],
                debitGroup1: [null],
                debitGroup2: [null],
                credit: [null],
                creditProcess: [null],
                creditGroup1: [null],
                creditGroup2: [null],
                amountInDram: [0],
                comment: [null],
                id: [null]
            }))
        }
    }


    public calculateTotalSum(): number {
        let sum: number = 0
        if (this.operationFormArray && this.operationFormArray.controls) {
            for (let item of this.operationFormArray.controls) {
                if (item.get('amountInDram').value) {
                    sum += (item.get('amountInDram').value) ? +item.get('amountInDram').value : 0
                }
            }
        }
        return sum
    }
    public change(): void {
        let sum: number = 0
        if (this.operationFormArray && this.operationFormArray.controls) {

            for (let item of this.operationFormArray.controls) {
                if (item.get('amountInDram').value) {
                    sum += (item.get('amountInDram').value) ? +item.get('amountInDram').value : 0
                }
            }
        }
        this.totalSum = sum
    }
    public setValue(event, controlName: string, form: FormGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)

    }
    public setModalParams(title: string, tabs: Array<string>, properties: Array<string>) {
        let modalParams = { tabs: tabs, title: title, keys: properties };
        return modalParams
    }
    // public setModalParams(title: string, codeKeyName: string) {
    //     let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
    //     return modalParams
    // }

    public setInputValue(controlName: string, property: string, form: FormGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
    get typeOperation(): boolean {
        return this._typeOperation
    }
}
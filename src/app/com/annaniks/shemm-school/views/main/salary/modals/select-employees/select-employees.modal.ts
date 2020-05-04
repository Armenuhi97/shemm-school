import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'select-employees-modal',
    templateUrl: 'select-employees.modal.html',
    styleUrls: ['select-employees.modal.scss']
})
export class SelectEmployeeModal {
    public title: string="Աշխատակիցներ";
    public employeeArray=[{timecardNumber:'0001',name:'Խալաթյան Լուսինե',unit:'Աշխատակազմ',position:''}]
    constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<SelectEmployeeModal>) { }
    public close(event) {
        if (event) {
            this._dialogRef.close()
        }
    }
    public selectEmployee(employee){
        this._dialogRef.close(employee)
    }
 }
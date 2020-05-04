import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../../views/main/main.service';
import { LoadingService, AppService } from '../../services';

@Component({
    selector: 'day-tabel-modal',
    templateUrl: 'day-tabel.modal.html',
    styleUrls: ['day-tabel.modal.scss'],
    // providers: [{ provide: MAT_DIALOG_DATA, useValue: {} },
    // { provide: MatDialogRef, useValue: {} }]
})
export class DaysTabelModal {
    public weekDaysGroup: FormGroup;
    public weekDays = [{ name: 'Երկուշաբթի', key: 'monday' },
    { name: 'Երեքշաբթի', key: 'tuesday' },
    { name: 'Չորեքշաբթի', key: 'wednesday' },
    { name: 'Հինգշաբթի', key: 'thursday' },
    { name: 'Ուրբաթ', key: 'friday' }]
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<DaysTabelModal>,
        private _fb: FormBuilder,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this._validate()
    }

    ngIOnInit() {
    }
    private _validate() {
        this.weekDaysGroup = this._fb.group({
            monday: [null, Validators.required],
            tuesday: [null, Validators.required],
            wednesday: [null, Validators.required],
            thursday: [null, Validators.required],
            friday: [null, Validators.required],
        })
        if (this._data && this._data.value) {
            if (this._data && this._data.value) {
                this._data.value.forEach((value) => {
                    if (value && value.id)
                        this.weekDaysGroup.addControl(value.day + 'id', this._fb.control(value.id, Validators.required))
                    if (value.employeePositionId)
                        this.weekDaysGroup.addControl(value.day + 'employeePositionId', this._fb.control(value.employeePositionId, Validators.required))
                    this.weekDaysGroup.get(value.day).setValue(value.hours)
                })
            }
        }

    }
    public close() {
        this._dialogRef.close()
    }
    public save() {
        this._appService.markFormGroupTouched(this.weekDaysGroup)
        if (this.weekDaysGroup.valid) {
            let daysHourArray = []
            this.weekDays.forEach((data) => {
                let obj={ day: data.key, hours: +this.weekDaysGroup.get(data.key).value }
                if(this.weekDaysGroup.get(data.key+'id') && this.weekDaysGroup.get(data.key+'employeePositionId')){
                    obj['id']=this.weekDaysGroup.get(data.key+'id').value;
                    obj['employeePositionId']=this.weekDaysGroup.get(data.key+'employeePositionId').value
                }
                daysHourArray.push(obj)
            })            
            this._dialogRef.close({ value: daysHourArray })
        }

    }
    public getControlName(day): string {
        return day.key
    }
}
import { Component, Input, Inject, Output, EventEmitter } from "@angular/core";
import { FormArray, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ComponentDataService, AppService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-average-salary',
    templateUrl: 'average-salary․component.html',
    styleUrls: ['average-salary․component.scss']
})
export class AvarageSalaryComponent {
    private _subscription: Subscription;
    public avarageSalaryGroupArray: FormArray;
    public totalAmount = new FormControl(0);
    private _avarageMonth: number;
    private _avarageBenefit: number;
    private _avarageDaily: number;
    public dailyCoefficient: number;
    private _isMotherBenefit = false;
    @Input('benefit')
    set setBenefit($event) {
        if ($event && $event.code == 946) {
            this._isMotherBenefit = true
        } else {
            this._isMotherBenefit = false
        }
    }
    @Output('getAvarageSalary') private _avarage: EventEmitter<{ avarageMonth: number, avaragDaily: number }> = new EventEmitter()
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.avarageSalaryGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.avarageSalaryGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });
            this.change()

        }
    }
    @Input('dailyCoefficient')
    set setDailyCofficient($event) {
        this.dailyCoefficient = $event
    }
    constructor(private _fb: FormBuilder, private _matDialog: MatDialog, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        @Inject('CALENDAR_CONFIG') public calendarConfig, ) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.avarageSalaryGroupArray) {
                    let isValid = this.avarageSalaryGroupArray && this.avarageSalaryGroupArray.valid ? true : false;
                    this._avarage.emit({ avarageMonth: this._avarageMonth, avaragDaily: this._avarageDaily })
                    this._componentDataService.sendData(this.avarageSalaryGroupArray.controls, 'avarageSalary', isValid)
                }
            }
        })
    }
    public focus(item: FormGroup, controlName: string): void {
        this._appService.focus(item, controlName)
    }

    public blur(item: FormGroup, controlName: string): void {
        this._appService.blur(item, controlName)
    }
    public change(): void {
        let sum: number = 0
        if (this.avarageSalaryGroupArray && this.avarageSalaryGroupArray.controls) {

            for (let item of this.avarageSalaryGroupArray.controls) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0
                }
            }
        }
        this.totalAmount.setValue(this._appService.roundSum(+sum))
    }
    private _validate(): void {
        this.avarageSalaryGroupArray = this._fb.array([])
    }

    public setValue(event, controlName: string, form: FormGroup): void {
        form.get(controlName).setValue(event)

    }
    public setModalParams(title: string, codeKeyName: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }

    public setInputValue(controlName: string, property: string, form: FormGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
    get avarageMonth() {
        this._avarageMonth = +this.totalAmount.value / 12
        return `${this._appService.roundSum(+this._avarageMonth)} = ${this._appService.roundSum(+this.totalAmount.value)} / 12`
    }
    get avaragBenefit() {
        let index = this._isMotherBenefit ? 1 : 0.8
        this._avarageBenefit = +this._avarageMonth * index
        return `${this._appService.roundSum(+this._avarageBenefit)} = ${this._appService.roundSum(+this._avarageMonth)} * ${index}`
    }
    get avaragDaily() {
        if (this.dailyCoefficient) {
            this._avarageDaily = (+this._avarageBenefit / +this.dailyCoefficient)
            return `${this._appService.roundSum(+this._avarageDaily)} = ${this._appService.roundSum(+this._avarageBenefit)} / ${this.dailyCoefficient}`
        } else {
            this._avarageDaily = 0
            return 0
        }
    }
}
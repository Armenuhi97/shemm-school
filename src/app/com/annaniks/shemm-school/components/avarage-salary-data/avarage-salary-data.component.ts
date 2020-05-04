import { Component, Inject, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ComponentDataService, AppService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-avarage-salary-data',
    templateUrl: 'avarage-salary-data.component.html',
    styleUrls: ['avarage-salary-data.component.scss']
})
export class AvarageSalaryDataComponent {
    private _subscription: Subscription;
    public avarageSalaryGroupArray: FormArray;
    public totalAmount = new FormControl(0);
    public totalMonthPart = new FormControl(0)
    private _avarageMonth: number;
    private _count: number = 0
    private _avarageDaily: number;
    private _dailyCoefficient: number;
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.length) {
            this.avarageSalaryGroupArray = this._fb.array([]);
            $event.forEach(element => {
                this.avarageSalaryGroupArray.push(element);
                this._appService.markFormGroupTouched(element)
            });
            this.change('amount', this.totalAmount)
            this.change('monthPart', this.totalMonthPart)
        }
    }
    @Input('dailyCoefficient')
    set setDailyCofficient($event) {
        this._dailyCoefficient = +$event
    }
    @Output('getAvarageSalary') private _avarage: EventEmitter<{ avarageMonth: number, avaragDaily: number }> = new EventEmitter()

    constructor(private _fb: FormBuilder, private _matDialog: MatDialog, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        @Inject('CALENDAR_CONFIG') public calendarConfig, ) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.avarageSalaryGroupArray) {
                    this._avarage.emit({ avarageMonth: this._avarageMonth, avaragDaily: this._avarageDaily })
                    let isValid = this.avarageSalaryGroupArray && this.avarageSalaryGroupArray.valid ? true : false;
                    this._componentDataService.sendData(this.avarageSalaryGroupArray.controls, 'avarageSalary', isValid)
                }
            }
        })
    }
    public focus(item:FormGroup, controlName: string): void {
        this._appService.focus(item,controlName)
    }

    public blur(item:FormGroup, controlName: string): void {
        this._appService.blur(item,controlName)
    }
    public change(controlName: string, formControl: FormControl): void {
        let sum: number = 0;
        if (controlName == 'amount')
            this._count = 0
        if (this.avarageSalaryGroupArray && this.avarageSalaryGroupArray.controls) {

            for (let item of this.avarageSalaryGroupArray.controls) {
                if (controlName == 'amount') {
                    if (item.get('isConsider').value) {

                        this._count++
                        sum += (item.get(controlName).value) ? +item.get(controlName).value : 0
                    }
                } else {
                    sum += (item.get(controlName).value) ? +item.get(controlName).value : 0
                }

            }
        }

        formControl.setValue(this._appService.roundSum(+sum))
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
    public changeIsConsider() {
        this.change('amount', this.totalAmount)

    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
    get avarageMonth() {
        this._avarageMonth = (this._count ? (+this.totalAmount.value / this._count) : 0) + +this.totalMonthPart.value / 12;
        let totalValue = this._count ? `${this._appService.roundSum(+this.totalAmount.value)} / ${this._count}` : 0
        return `${this._appService.roundSum(+this._avarageMonth)} = ${totalValue} + ${this._appService.roundSum(+this.totalMonthPart.value)} / 12 `
    }

    get avaragDaily() {
        if (this._dailyCoefficient) {
            this._avarageDaily = +this._avarageMonth / +this._dailyCoefficient
            return `${this._appService.roundSum(+this._avarageDaily)} = ${this._appService.roundSum(+this._avarageMonth)} / ${this._dailyCoefficient}`
        } else {
            this._avarageDaily = 0
            return 0
        }

    }
}
import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountPlan, Provisions } from '../../models/global.models';
import { AppService, ComponentDataService, OftenUsedParamsService } from '../../services';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-vacation-time-common',
    templateUrl: 'vacation-time-common.component.html',
    styleUrls: ['vacation-time-common.component.scss']
})
export class VacationTimeCommonComponent {
    public vacationTimeGroup: FormGroup;
    private _subscription: Subscription;
    public chartAccounts: AccountPlan[] = [];
    public minDate: Date;
    public maxDate: Date;
    private _totalSum: number = 0;
    private _cofficient: number;

    private _isUpdate: boolean = false
    @Input('chartAccounts')
    set setChartAccount($event: AccountPlan[]) {
        this.chartAccounts = $event;
        this.vacationTimeGroup.get('expenseAccount').setValue(this.chartAccounts[0])
    }

    @Input('provisions')
    set setProvisions($event: Provisions) {
        if ($event) {
            this._cofficient = +$event.averageDailyCoefficientVacation;
            this.vacationTimeGroup.get('dailyCoefficient').setValue(this._cofficient);
            this.vacationTimeGroup.get('transitAccount').setValue(this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, +$event.transitAccount, 'id'), 0));
        }
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.old) {
            this._isUpdate = true;
            delete $event.old
        } else {
            this._isUpdate = false
        }
        if ($event) {
            this.vacationTimeGroup.patchValue($event);
            // if ($event.dailyCoefficient)
            //     this._cofficient = $event.dailyCoefficient
            this._appService.markFormGroupTouched(this.vacationTimeGroup);
            if ($event.listArray && $event.listArray.length) {
                (this.vacationTimeGroup.controls.listArray as FormArray) = this._fb.array([])
                $event.listArray.forEach(element => {
                    (this.vacationTimeGroup.get('listArray') as FormArray).push(element)
                    this._appService.markFormGroupTouched(element);
                });
                this.change('day', 'totalday')
                this.change('amount', 'totalamount')
            }
            if (this._cofficient) {
                this.vacationTimeGroup.get('dailyCoefficient').setValue(this._cofficient)
            }

            this.changeDate()
        }
    }
    @Input('totalSum')
    set setTotalAmount($event: number) {
        if ($event || $event == 0) {
            this._totalSum = $event;
            this.vacationTimeGroup.get('avarageSalary').setValue(this._appService.roundSum(+this._totalSum));
            this.vacationTimeGroup.get('avarageDaily').setValue(this._appService.roundSum(this.vacationTimeGroup.get('dailyCoefficient').value ? +this._totalSum / +this.vacationTimeGroup.get('dailyCoefficient').value : 0))
        }
    }

    constructor(private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _datePipe: DatePipe,
        private _oftenUsedParamsService: OftenUsedParamsService,
        @Inject('CALENDAR_CONFIG') public calendarConfig) {
        this.validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                this._sendData('general', false)
            }
        })
    }
    private _sendData(tabsName: string, valid: boolean) {
        if (this.vacationTimeGroup) {
            let isValid = valid ? valid : this.vacationTimeGroup.valid;
            this._componentDataService.sendData(this.vacationTimeGroup, tabsName, isValid);
        }

    }

    public blur(item: FormGroup, controlName: string) {
        this._appService.blur(item, controlName)
    }
    public focus(item: FormGroup, controlName: string) {
        this._appService.focus(item, controlName)
    }
    public disabelOrEnable() {
        // let isEdit = this.vacationTimeGroup.get('isEdit').value;
        // this.vacationTimeGroup.get('isEdit').setValue(!isEdit);
        // if(this.vacationTimeGroup.get('isEdit').value){
        //     this.vacationTimeGroup.get('avarageSalary').enable()
        // }else{
        //     this.vacationTimeGroup.get('avarageSalary').disable()
        // }
    }
    private validate() {
        this.vacationTimeGroup = this._fb.group({
            startDate: [null],
            endDate: [null],
            monthCount: [12],
            dailyCoefficient: [null],
            avarageSalary: [0],
            // this._fb.control({ value: 0, disabled: true }),
            avarageDaily: [0],
            isEdit: [false],
            expenseAccount: [null],
            transitAccount: [null],
            totalday: [0],
            totalamount: [0],
            listArray: this._fb.array([])
        })
    }

    private _checkIsHasDate(value) {
        return value ? new Date(value) : value

    }
    private _checkIsUpdate() {
        let start = this.vacationTimeGroup.get('startDate').value;
        let end = this.vacationTimeGroup.get('endDate').value
        let startFormat = this._datePipe.transform(start, 'yyyy-MM-dd');
        let endDateFormat = this._datePipe.transform(end, 'yyyy-MM-dd')
        if (!this._isUpdate || (this._isUpdate && (startFormat !== this._oftenUsedParamsService.getStartDate() || endDateFormat !== this._oftenUsedParamsService.getEndDate()))) {
            return true
        } else {
            return false
        }
    }
    public changeDate() {
        if (this._checkIsUpdate()) {
            let start = this.vacationTimeGroup.get('startDate').value;

            let end = this.vacationTimeGroup.get('endDate').value
            if (start) {
                this.minDate = new Date(start);
                let count = 1;
                if (start.getDay() + 1 == 6) {
                    count = 3
                }
                if (start.getDay() + 1 == 7) {
                    count = 2
                }
                this.minDate.setDate(start.getDate() + count)
                this.maxDate = new Date(start);
                let days: number = 0;
                let weekendDays: number = 0;
                let i = start.valueOf()
                while (days < 35) {
                    let temp = new Date(i);
                    if (temp.getDay() !== 6 && temp.getDay() !== 0) {
                        days++;
                    } else {
                        weekendDays++;
                    }
                    i += 86400000
                }
                let maxDateAddedCount = days + weekendDays - 1;

                this.maxDate.setDate(start.getDate() + maxDateAddedCount);
                let startFormat = this._datePipe.transform(start, 'yyyy-MM-dd');
                let endDateFormat = this._datePipe.transform(end, 'yyyy-MM-dd')
                if (startFormat !== this._oftenUsedParamsService.getStartDate())
                    this._sendData('general2', true);
                this._oftenUsedParamsService.setStartDate(startFormat)
                this._oftenUsedParamsService.setEndDate(endDateFormat)
                if (end) {
                    if (end < this.minDate || end > this.maxDate) {
                        this.vacationTimeGroup.get('endDate').setValue(null);
                        return
                    }
                    // (this.additionsGroup.controls[key] as FormArray) = this._fb.array([])
                    (this.vacationTimeGroup.controls['listArray'] as FormArray) = this._fb.array([])
                    // this.vacationTimeGroup.setControl('listArray', this._fb.array([]));
                    let datesArray = [];
                    let month: number = null;
                    let days = 0;
                    let year: number;
                    console.log(start);

                    for (let i = start.valueOf(); i <= end.valueOf(); i += 86400000) {
                        let temp = new Date(i);
                        if (temp.getMonth() + 1 !== month) {
                            if (month) {
                                datesArray.push({
                                    month: month,
                                    days: days,
                                    date: new Date(year, month - 1)
                                })
                            }
                            days = 0;
                            if (temp.getDay() !== 6 && temp.getDay() !== 0) {
                                days++
                            }
                            month = temp.getMonth() + 1;

                        } else {
                            if (temp.getDay() !== 6 && temp.getDay() !== 0) {
                                days++;

                            }
                            year = temp.getFullYear();
                            if (i == end.valueOf()) {
                                datesArray.push({
                                    month: month,
                                    days: days,
                                    date: new Date(year, month - 1)
                                })

                            }

                        }

                    }

                    datesArray.forEach((data) => {
                        (this.vacationTimeGroup.get('listArray') as FormArray).push(this._fb.group({
                            monthName: this._appService.checkProperty(this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.monthNames, data.month, 'id'), 0), 'name'),
                            date: data.date,
                            day: data.days,
                            amount: this._appService.roundSum(+data.days * +this.vacationTimeGroup.get('avarageDaily').value)
                        }))
                    })

                    this.change('day', 'totalday')
                    this.change('amount', 'totalamount')
                } else {

                    this._deleteList()
                }

            } else {
                this.minDate = null;
                this.maxDate = null
                this._deleteList()
            }
        }
    }
    private _deleteList() {
        (this.vacationTimeGroup.controls['listArray'] as FormArray) = this._fb.array([])
        // this.vacationTimeGroup.setControl('listArray', this._fb.array([]));
        this.vacationTimeGroup.get('totalday').setValue(0);
        this.vacationTimeGroup.get('totalamount').setValue(0)
    }
    public changeAvarageDaily() {
        if (this._checkIsUpdate())
            this._calculateVacationAmountForEachMonth()
    }
    private _calculateVacationAmountForEachMonth() {
        let formArray = (this.vacationTimeGroup.get('listArray') as FormArray);
        formArray.controls.forEach((data) => {
            data.patchValue({
                amount: data.get('day').value * this.vacationTimeGroup.get('avarageDaily').value
            })
        })
        this.change('day', 'totalday')
        this.change('amount', 'totalamount')
    }
    public getFormControl(controlName, id) {
        return (controlName + id)
    }
    public change(controlName: string, setControlName: string) {
        let sum: number = 0;
        let formArray = this.vacationTimeGroup.get('listArray') as FormArray
        if (formArray && formArray.controls) {

            for (let item of formArray.controls) {
                if (item.get(controlName).value) {
                    sum += (item.get(controlName).value) ? +item.get(controlName).value : 0
                }
            }
        }
        this.vacationTimeGroup.get(setControlName).setValue(controlName == 'amount' ? this._appService.roundSum(+sum) : sum)

    }

    public setValue(event, controlName: string, form: FormGroup = this.vacationTimeGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)

    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.vacationTimeGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AccountPlan, Provisions, JsonObjectType } from '../../models/global.models';
import { AppService, ComponentDataService, OftenUsedParamsService } from '../../services';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-benefits-common',
    templateUrl: 'benefits-common.component.html',
    styleUrls: ['benefits-common.component.scss']
})
export class BenefitsCommonComponent {
    private _isUpdate: boolean = false
    public benefitsGroup: FormGroup;
    private _subscription: Subscription;
    public chartAccounts: AccountPlan[] = [];
    private _byTheEmployee: number = 0
    private _stateBudgetDays: number = 0
    public minDate: Date;
    private _benefit: JsonObjectType;
    private _coefficient: number = 0.8
    private _provisions: Provisions;
    private _totalSum: number = 0;

    @Input('provisions')
    set setProvisions($event: Provisions) {
        this._provisions = $event;
    }


    @Input('benefit')
    set setBenefit($event) {
        this._benefit = $event;
        if (this._provisions)
            if (this._benefit && this._benefit.code == 946) {
                this._coefficient = 1
                this.benefitsGroup.get('dailyCoefficient').setValue(this._provisions.averageDailyCoefficientMaternityBenefit)
            } else {
                this._coefficient = 0.8
                this.benefitsGroup.get('dailyCoefficient').setValue(this._provisions.averageDailyCoefficientBenefit)
            }
        this._createListArrayFomMaternityBenefit()
        this._calculateSalary();
        this.changeDate()
    }

    @Input('chartAccounts')
    set setChartAccount($event: AccountPlan[]) {
        this.chartAccounts = $event;
        if (!this.benefitsGroup.get('expenseAccount').value)
            this.benefitsGroup.get('expenseAccount').setValue(this.chartAccounts[0])

    }


    @Input('group')
    set setFormGroup($event) {
        if ($event && $event.old) {
            this._isUpdate = true;
            delete $event.old
        } else {
            this._isUpdate = false
        }
        let value = $event;

        if (value) {

            this.benefitsGroup.patchValue(value);
            this._appService.markFormGroupTouched(this.benefitsGroup);
            if (value.listArray && value.listArray.length) {
                (this.benefitsGroup.controls.listArray as FormArray) = this._fb.array([])
                value.listArray.forEach(element => {
                    (this.benefitsGroup.get('listArray') as FormArray).push(element)
                    this._appService.markFormGroupTouched(element);
                });
                this.change('day', 'totalday')
                this.change('amount', 'totalamount');
                this.changeDate()
            }
        }
    }
    @Input('totalAmount')
    set setTotalAmount($event: number) {
        if ($event || $event == 0) {
            this._totalSum = $event;

            if (this._benefit)
                this._calculateSalary()
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
    private _checkIsUpdate() {
        let start = this.benefitsGroup.get('startDate').value;
        let end = this.benefitsGroup.get('endDate').value
        let startFormat = this._datePipe.transform(start, 'yyyy-MM-dd');
        let endDateFormat = this._datePipe.transform(end, 'yyyy-MM-dd')
        if (!this._isUpdate || (this._isUpdate && (startFormat !== this._oftenUsedParamsService.getStartDate() || endDateFormat !== this._oftenUsedParamsService.getEndDate()))) {
            return true
        } else {
            return false
        }
    }
    private _calculateSalary() {
        let avarageSalary = this._totalSum / 12
        this.benefitsGroup.get('avarageSalary').setValue(this._appService.roundSum(+avarageSalary));
        let benefitAvarage = +this.benefitsGroup.get('avarageSalary').value * +this._coefficient;
        let dailySum = this.benefitsGroup.get('dailyCoefficient').value ? +benefitAvarage / +this.benefitsGroup.get('dailyCoefficient').value : 0;
        this.benefitsGroup.get('avarageDaily').setValue(this._appService.roundSum(+dailySum));
    }
    
    private _createListArrayFomMaternityBenefit() {
            if (this._benefit && this._benefit.code == 946) {
                this.benefitsGroup.setControl('listArray', this._fb.array([]));
                let start = this.benefitsGroup.get('startDate').value;
                let end = this.benefitsGroup.get('endDate').value;
                let datesArray = [];
                if (start && end) {

                    let month: number = null;
                    let days = 0;
                    let year;
                    for (let i = start.valueOf(); i <= end.valueOf(); i += 86400000) {
                        let temp = new Date(i);
                        if (temp.getMonth() + 1 !== month) {
                            if (month)
                                datesArray.push({
                                    month: month,
                                    days: days,
                                    date: new Date(year, month - 1)
                                })
                            days = 1;
                            month = temp.getMonth() + 1;

                        } else {
                            days++;
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
                        (this.benefitsGroup.get('listArray') as FormArray).push(this._fb.group({
                            date: this._datePipe.transform(data.date, 'MM/yyyy'),
                            day: data.days,
                            amount: data.days * (this.benefitsGroup.get('avarageDaily').value ? this._appService.roundSum(+this.benefitsGroup.get('avarageDaily').value) : 0)

                        }))
                    })

                }

            } else {
                this.benefitsGroup.setControl('listArray', this._fb.array([this._fb.group({
                    accountName: 'Գործատուի հաշվին',
                    id: 1,
                    day: [null],
                    amount: [null]
                }),
                this._fb.group({
                    accountName: 'Պետ բյուջեի հաշվին',
                    day: [null],
                    id: 2,
                    amount: [null]
                })]))

            }
            this._setBenefitsAmount()
    }
    private _sendData(tabsName: string, valid: boolean) {
        if (this.benefitsGroup) {
            let isValid = valid ? valid : this.benefitsGroup.get('listArray').valid;
            this._componentDataService.sendData(this.benefitsGroup, tabsName, isValid);
        }
    }

    private validate() {
        this.benefitsGroup = this._fb.group({
            startDate: [null],
            endDate: [null],
            monthCount: [12],
            dailyCoefficient: [null],
            avarageSalary: [0],
            avarageDaily: [0],
            expenseAccount: [null],
            // transitAccount: [null],
            totalday: [0],
            totalamount: [0],
            listArray: this._fb.array([
                this._fb.group({
                    accountName: 'Գործատուի հաշվին',
                    id: 1,
                    day: [null],
                    amount: [null]
                }),
                this._fb.group({
                    accountName: 'Պետ բյուջեի հաշվին',
                    day: [null],
                    id: 2,
                    amount: [null]
                })
            ])
        })
    }
    public blur(item: FormGroup, controlName: string) {
        this._appService.blur(item, controlName)
    }
    public focus(item: FormGroup, controlName: string) {
        this._appService.focus(item, controlName)
    }
    public changeDate() {
        if (this._checkIsUpdate()) {
            let benefitsDayCount: number = 0;
            let weekendsCount: number = 0;
            let dateCount: number = 0;
            let start = this.benefitsGroup.get('startDate').value;
            let end = this.benefitsGroup.get('endDate').value;

            if (start) {
                this.minDate = new Date(start);
                let count = 2;
                if ((start.getDay() + 1 == 6) || (start.getDay() + 1 == 7) || (start.getDay() == 4)) {
                    count = 4
                }
                if (start.getDay() == 0) {
                    count = 3
                }
                this.minDate.setDate(start.getDate() + count)
                let startFormat = this._datePipe.transform(start, 'yyyy-MM-dd');

                if (startFormat !== this._oftenUsedParamsService.getStartDate())
                    this._sendData('general2', true);
                this._oftenUsedParamsService.setStartDate(startFormat)
                if (end) {
                    if (end < this.minDate) {
                        this.benefitsGroup.get('endDate').setValue(null);
                        return
                    }
                    this._createListArrayFomMaternityBenefit()
                    if (!this._benefit || (this._benefit && this._benefit.code !== 946)) {
                        for (let i = start.valueOf(); i <= end.valueOf(); i += 86400000) {
                            let temp = new Date(i);
                            dateCount++
                            if (temp.getDay() == 6 || temp.getDay() == 0) {
                                weekendsCount++
                            }
                        }
                        benefitsDayCount = dateCount - weekendsCount - 1;
                        this._byTheEmployee = benefitsDayCount >= 5 ? 5 : benefitsDayCount
                        this._stateBudgetDays = benefitsDayCount >= 5 ? benefitsDayCount - this._byTheEmployee : 0;
                        this._setBenefitsAmount();
                    }
                } else {
                    this._deleteList()
                }
            } else {
                this.minDate = null;
                this._deleteList()
            }
        }
    }
    private _deleteList() {
        this.benefitsGroup.setControl('listArray', this._fb.array([]));
        this.benefitsGroup.get('totalday').setValue(0);
        this.benefitsGroup.get('totalamount').setValue(0)
    }
    public changeAvarageDaily() {
        if (this._checkIsUpdate())
            this._setBenefitsAmount()
    }
    private _setBenefitsAmount() {
        let formArray = (this.benefitsGroup.get('listArray') as FormArray);
        formArray.controls.forEach((data) => {
            if (!this._benefit || (this._benefit && this._benefit.code !== 946)) {
                if (data.get('id').value == 1) {
                    data.patchValue({
                        day: this._byTheEmployee,
                        amount: this._appService.roundSum(+this._byTheEmployee * +this.benefitsGroup.get('avarageDaily').value)
                    })
                } else {
                    data.patchValue({
                        day: this._stateBudgetDays,
                        amount: this._appService.roundSum(+this._stateBudgetDays * +this.benefitsGroup.get('avarageDaily').value)
                    })
                }
            } else {
                data.patchValue({
                    amount: this._appService.roundSum(+data.get('day').value * +this.benefitsGroup.get('avarageDaily').value)
                })
            }
        })
        this.change('day', 'totalday')
        this.change('amount', 'totalamount');
    }
    public getFormControl(controlName: string, id) {
        return (controlName + id)
    }
    public change(controlName: string, setControlName: string) {
        let sum: number = 0;
        let formArray = this.benefitsGroup.get('listArray') as FormArray
        if (formArray && formArray.controls) {

            for (let item of formArray.controls) {
                if (item.get(controlName).value) {
                    sum += (item.get(controlName).value) ? +item.get(controlName).value : 0
                }
            }
        }
        this.benefitsGroup.get(setControlName).setValue(controlName == 'amount' ? this._appService.roundSum(+sum) : sum)

    }

    public setValue(event, controlName: string, form: FormGroup = this.benefitsGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }
    public setInputValue(controlName: string, property: string, form: FormGroup = this.benefitsGroup) {
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
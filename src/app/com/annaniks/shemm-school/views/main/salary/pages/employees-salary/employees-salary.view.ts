import { Component, Inject } from "@angular/core";
import { MainService } from '../../../main.service';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ServerResponse, DataCount, SalaryEmployee, Additions, JsonObjectType, AccountPlans, SalaryOperation, Provisions, Employees, Salary } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService, AppService, OftenUsedParamsService, ComponentDataService } from 'src/app/com/annaniks/shemm-school/services';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SalaryService } from '../../salary.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { ConfirmModal } from 'src/app/com/annaniks/shemm-school/modals';

@Component({
    selector: 'employees-salary-view',
    templateUrl: 'employees-salary.view.html',
    styleUrls: ['employees-salary.view.scss']
})
export class EmployeesSalararyView {
    private _isExist: boolean = false
    private _existSalaryId: number;
    public isGetMainElements: boolean = false;
    public salaries = [];
    private _allEmployees: Employees[] = []
    private _provisions: Provisions
    public chartAccounts: AccountPlans[] = [];
    public isShowTable: boolean = true
    public date = this._fb.control(null, Validators.required)
    public totalAdditionSum: number = 0
    public employees: SalaryEmployee[] = []
    public isShowAdditions: boolean = false
    public additions: Additions[] = [];
    private _subscription: Subscription;
    public salaryGroup: FormGroup;
    public isSet: boolean;
    public benefits: JsonObjectType[] = []
    public operations = []
    public holds = [];
    private _subscription1: Subscription

    constructor(private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        private _oftenUsedParams: OftenUsedParamsService,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _salariesService: SalaryService,
        @Inject('URL_NAMES') private _urls,
        private _matDialog: MatDialog,
        private _title: Title,
        private _messageService: MessageService, ) {
        this._title.setTitle('Աշխատակիցների աշխատավարձի հաշվարկ')
        this._validate()
    }

    ngOnInit() {
        this._combineMainRequest();
        this._setData()
    }

    private _setData(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                this.operations = data.data
            }
        })
    }

    private _validate(): void {
        this.salaryGroup = this._fb.group({})
    }
    private _getEmployeesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.employeeMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAllEmployees(data.data.count)
            })
        )
    }
    private _getAllEmployees(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
            map((data: ServerResponse<Employees[]>) => {
                this._allEmployees = data.data;
            })
        )
    }
    private _combineMainRequest(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getAdditionsCount(),
            this._getHoldsCount(),
            this._mainService.getAccountsPlan(),
            this._mainService.getBenefits(),
            this._mainService.getProvisions(),
            this._getEmployeesCount()

        )
        this._subscription = combine.subscribe(() => {
            this.isGetMainElements = true
            this.benefits = this._oftenUsedParams.getBenefit();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this._provisions = this._oftenUsedParams.getProvisions();
            this._loadingService.hideLoading()

        })
    }
    
    private _checkIsHasDate() {
        let dateFormat = this._datePipe.transform(this.date.value, 'yyyy-MM');        
        let date = this.date.value ? this._datePipe.transform(this.date.value, 'yyyy-MM-dd') : null
        this._salariesService.checkIsHasSalaryByDate(date).subscribe((data: ServerResponse<Salary[]>) => {
            if (data.data && data.data.length) {
                this._isExist = true;
                this._existSalaryId = data.data[0].id;
                if (this._isExist) {
                    let dialogRef = this._matDialog.open(ConfirmModal, {
                        width: '700px',
                        data: {
                            text: 'Այս ամսաթվով աշխատավարձ գոյություն ունի, ցանկանու՞մ եք այն փոփոխել',
                            link: this._existSalaryId
                        }
                    })
                    dialogRef.afterClosed().subscribe((data) => {
                        if (data) {
                            this._getEmployees(dateFormat)
                        }
                    })
                } else {
                    this._getEmployees(dateFormat)
                }
            }else{
                this._getEmployees(dateFormat)
            }
        })
    }
    public changeDate($event) {
        if (this.date.value) {
            this.isSet = false
            this.salaryGroup = this._fb.group({})

            this._checkIsHasDate()
        }

    }

    // private _checkIsHasDate() {
    //     let date = this.date.value ? this._datePipe.transform(this.date.value, 'yyyy-MM-dd') : null
    //     this._salariesService.checkIsHasSalaryByDate(date).subscribe((data: ServerResponse<Salary[]>) => {
    //         if (data.data && data.data.length) {
    //             this._isExist = true;
    //             this._existSalaryId = data.data[0].id;
                
    //         }
    //     })
    // }
    // public changeDate($event) {
    //     if (this.date.value) {
    //         this.isSet = false
    //         this.salaryGroup = this._fb.group({})
    //         let date = this._datePipe.transform(this.date.value, 'yyyy-MM');
    //         this._getEmployees(date)
    //         this._checkIsHasDate()
    //     }

    // }
    public getLength(array, key: string) {
        if (array && array.length) {
            if (!this.getIsShow(key)) {
                return 1
            } else {
                return array.length + 1
            }
        } else {
            return 0
        }
    }

    public focus(employee: SalaryEmployee, element, key: string): void {
        let controlName = this.getFormControlName(element);
        if (this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).value == 0)
            this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).setValue(null)
    }

    public blur(employee: SalaryEmployee, element, key: string): void {
        if (this.salaryGroup) {
            let controlName = this.getFormControlName(element);
            if (this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).value == null || this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).value == 0)
                this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).setValue(0)
        }
    }
    public getMaxLenghtOfVacations() {
        let maxLengthOfVacation = 0;

        for (let employee of this.employees) {
            if (!maxLengthOfVacation || maxLengthOfVacation < employee.employeeVacations.length) {
                maxLengthOfVacation = employee.employeeVacations.length + 1;
            }
        }
        if (!this.getIsShow('vacation') && maxLengthOfVacation) {
            return 1
        }
        return maxLengthOfVacation

    }
    public checkIsEmptyVacation() {
        let count = 0
        this.employees.forEach((employee) => {
            if (employee.employeeVacations.length) {
                count++
            }
        })
        return count > 0 ? true : false
    }
    public getCountArrayOfVacation() {
        let array = []
        for (let i = 1; i <= this.getMaxLenghtOfVacations() - 1; i++) {
            array.push(i)
        }
        for (let employee of this.employees) {
            if (employee.employeeVacations.length < array.length) {
                let differencelength = array.length - employee.employeeVacations.length;
                for (let i = 0; i < differencelength; i++) {
                    employee.employeeVacations.push({ vacationMonths: [] })
                }
            }
        }
        return array
    }
    private _setCategoryControl(employee, array, key, ) {
        for (let element of array) {
            let formGroup = this.salaryGroup.get((employee.employeId).toString()).get(key) as FormGroup;
            formGroup.addControl((element.id).toString(), this._fb.control(0));
            formGroup.addControl((element.id).toString() + '+' + 'checkbox', this._fb.control(false));
            formGroup.addControl('total', this._fb.control(0));
        }
    }
    private _setEachElementControl(array, property, key: string) {
        for (let element of array) {
            this.salaryGroup.addControl((element[property]).toString() + key, new FormControl(false))
        }
    }
    private _setControl(): void {
        this._setEachElementControl(this.additions, 'id', 'addition')
        this._setEachElementControl(this.holds, 'id', 'hold')
        this._setEachElementControl(this.salaries, 'id', 'salary')
        this._setEachElementControl(this.employees, 'employeId', 'employee')
        this.salaryGroup.addControl('isaddition', new FormControl(false))
        this.salaryGroup.addControl('ishold', new FormControl(false))
        this.salaryGroup.addControl('isbenefit', new FormControl(false))
        this.salaryGroup.addControl('isvacation', new FormControl(false))
        this.salaryGroup.addControl('issalary', new FormControl(false))

        for (let employee of this.employees) {
            this.salaryGroup.addControl((employee.employeId).toString(), this._fb.group({}));
            let group = this.salaryGroup.get((employee.employeId).toString()) as FormGroup
            group.addControl('salaries', this._fb.group({}));
            group.addControl('additions', this._fb.group({}));
            group.addControl('holds', this._fb.group({}));
            group.addControl('benefits', this._fb.group({}));
            group.addControl('vacations', this._fb.group({}));
            let vacationGroup = this.salaryGroup.get((employee.employeId).toString()).get('vacations') as FormGroup;
            vacationGroup.addControl('total', this._fb.control(0));
            this._setCategoryControl(employee, this.additions, 'additions')
            this._setCategoryControl(employee, this.salaries, 'salaries')
            for (let benefit of this.benefits) {
                let formGroup = this.salaryGroup.get((employee.employeId).toString()).get('benefits') as FormGroup;
                formGroup.addControl('total', this._fb.control(0));
                formGroup.addControl((benefit.code).toString(), this._fb.group({ fromEmployee: 0, fromStateBudget: 0 }));
            }
            this._setCategoryControl(employee, this.holds, 'holds')
        }

        this._setValue()
        this.isSet = true
    }
    private _additionsAndHoldSalary(array, data, $event, key1, key2) {
        array.forEach((value) => {
            if (!this.salaryGroup.get(value.id.toString() + key1).value) {
                this.salaryGroup.get((data.employeId).toString()).get(key2).get(this.getCheckboxFormControlName(value)).setValue($event)
                let controlName = this.getFormControlName(value);
                if ($event) {
                    this.salaryGroup.get((data.employeId).toString()).get(key2).get(controlName).disable();
                    this.salaryGroup.get((data.employeId).toString()).get(key2).get(controlName).setValue(0)
                } else {
                    this.salaryGroup.get((data.employeId).toString()).get(key2).get(controlName).enable()
                }

            }

        })
    }
    public changeEmployee($event: boolean, employee: SalaryEmployee): void {
        this.employees.forEach((data) => {
            if (data.employeId == employee.employeId) {
                this._additionsAndHoldSalary(this.additions, data, $event, 'addition', 'additions')
                this._additionsAndHoldSalary(this.salaries, data, $event, 'salary', 'salaries')

                // this._additionsAndHoldSalary(this.holds, data, $event, 'hold', 'holds')

            }
        })
    }

    public changeEmployeeSalary($event: boolean, employee: SalaryEmployee, element, key: string, array): void {
        this.employees.forEach((data) => {
            if (data.employeId == employee.employeId) {
                array.forEach((val) => {
                    if (val.id == element.id) {
                        let controlName = this.getFormControlName(element);
                        if ($event) {
                            this.salaryGroup.get((data.employeId).toString()).get(key).get(controlName).disable();
                            this.salaryGroup.get((data.employeId).toString()).get(key).get(controlName).setValue(0)
                        } else {
                            this.salaryGroup.get((data.employeId).toString()).get(key).get(controlName).enable();
                            let sallary = data.income[element.id] ? data.income[element.id] : 0
                            this.salaryGroup.get((data.employeId).toString()).get(key).get(controlName).setValue(sallary)

                        }

                    }
                })
            }
        })
    }
    public changeAddition($event: boolean, element, key: string, array): void {
        this.employees.forEach((employee) => {

            array.forEach((val) => {
                if (+val.id == +element.id) {
                    if (!this.salaryGroup.get(employee.employeId.toString() + 'employee').value) {
                        let controlName = this.getFormControlName(element)
                        if ($event) {
                            this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).disable()
                            this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).setValue(0)
                        } else {
                            this.salaryGroup.get((employee.employeId).toString()).get(key).get(controlName).enable()
                        }
                        this.salaryGroup.get((employee.employeId).toString()).get(key).get(this.getCheckboxFormControlName(element)).setValue($event)

                    }

                }
            })
        })
    }

    private _getAdditionsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.additionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAdditions(data.data.count)
            })
        )
    }
    public delete(id: number): void {
        this._loadingService.showLoading()
        this._mainService.deleteByUrl(this._urls.groupSalariesGetOneUrl, id).subscribe((data) => {
            this._sendOperationOfSalary()
        }, (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading()
        })
    }
    private _getAdditions(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.additionMainUrl, count, 0).pipe(
            map((data: ServerResponse<Additions[]>) => {
                this.additions = [];
                this.salaries = [];
                data.data.forEach((element) => {
                    if (element.methodOfSallaryCalculation) {
                        if (+element.methodOfSallaryCalculation == 0 || +element.methodOfSallaryCalculation == 1 || +element.methodOfSallaryCalculation == 2) {
                            this.salaries.push(element)
                        } else {
                            this.additions.push(element)
                        }
                    } else {
                        this.additions.push(element)
                    }
                })

                this._setReplacement()
            })
        )
    }
    private _setReplacement(): void {
        this.salaries.push(
            {
                id: 0, name: 'Փոխարինում', isIncome: 1,
                typeOfVacation: { id: 1, name: "այո" }
            }
        )
    }

    private _getHoldsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.holdsMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getHolds(data.data.count)
            })
        )
    }
    private _getHolds(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.holdsMainUrl, count, 0).pipe(
            map((data: ServerResponse<any[]>) => {
                this.holds = data.data;
            })
        )
    }

    private _getEmployees(date: string): void {
        this._loadingService.showLoading()
        this._salariesService.getEmployeesSalary(date).subscribe((data: ServerResponse<SalaryEmployee[]>) => {
            this.employees = data.data;
            this._setControl();
            this._loadingService.hideLoading()
        })

    }
    checkIsShowSalariesRow() {
        if (this.getIsShow('salary') || this.getIsShow('addition') || this.getIsShow('benefit') || this.getIsShow('vacation') || this.getIsShow('hold')) {
            return true
        } else {
            return false
        }
    }
    public showOrHideButton(key: string) {
        let isShow = this.salaryGroup.get('is' + key).value
        this.salaryGroup.get('is' + key).setValue(!isShow)
    }

    public getIcon(key: string) {
        let isShow = this.salaryGroup.get('is' + key).value
        return isShow ? '-' : '+'
    }
    public getIsShow(key: string) {
        return this.salaryGroup.get('is' + key).value
    }
    public closeAllSSections(key: string) {
        this.salaryGroup.get('is' + key).setValue(false)
    }

    public calculateTotalSum(employee: SalaryEmployee, key: string, array) {
        let sum = 0;
        array.forEach((data) => {
            sum += this.salaryGroup.get((employee.employeId).toString()).get(key).get((data.id).toString()).value;
        })
        this.salaryGroup.get((employee.employeId).toString()).get(key).get('total').setValue(sum)
    }
    private _setTotalValue(employee: SalaryEmployee, key: string, sum: number) {
        this.salaryGroup.get((employee.employeId).toString()).get(key).get('total').setValue(sum)
    }
    public getTotalSum(employee: SalaryEmployee, key: string) {
        return this.salaryGroup.get((employee.employeId).toString()).get(key).get('total').value
    }
    private _setValue(): void {
        this.employees.forEach((employee) => {
            let additionSum: number = 0
            this.additions.forEach((addition) => {
                let value = this._appService.checkProperty(employee['income'], addition.id)
                if (value) {
                    let controlName = this.getFormControlName(addition);
                    this.salaryGroup.get((employee.employeId).toString()).get('additions').get(controlName).setValue(value);
                    additionSum += value

                }
            })
            this._setTotalValue(employee, 'additions', additionSum)
            let salarySum = 0
            this.salaries.forEach((salary) => {
                let value = this._appService.checkProperty(employee['income'], salary.id)
                if (value) {
                    let controlName = this.getFormControlName(salary);
                    this.salaryGroup.get((employee.employeId).toString()).get('salaries').get(controlName).setValue(value);
                    salarySum += value
                }
            })

            this._setTotalValue(employee, 'salaries', salarySum)
            let benefitSum = 0
            employee.employeeBenefits.forEach((data) => {
                let benefitCode = this._appService.checkProperty(this._appService.filterArray(this.benefits, data.benefit, 'name'), 0)
                if (benefitCode && data.benefitMain && data.benefitMain.id) {
                    this.salaryGroup.get((employee.employeId).toString()).get('benefits').get(benefitCode.code.toString()).get('fromEmployee').setValue(data.benefitMain.fromEmployer);
                    this.salaryGroup.get((employee.employeId).toString()).get('benefits').get(benefitCode.code.toString()).get('fromStateBudget').setValue(data.benefitMain.fromStateBudget);
                    benefitSum += data.benefitMain.fromEmployer + data.benefitMain.fromStateBudget;
                }
            })
            this._setTotalValue(employee, 'benefits', benefitSum);
            let vacationSum = 0;
            employee.employeeVacations.forEach((vacation) => {
                if (vacation.vacationMonths && vacation.vacationMonths[0] && vacation.vacationMonths[0].money) {
                    vacationSum += vacation.vacationMonths[0].money
                }
            })
            this._setTotalValue(employee, 'vacations', vacationSum);
        })

        this.closeAllSSections('salary')
        this.closeAllSSections('hold')
        this.closeAllSSections('addition')
        this.closeAllSSections('benefit')
        this.closeAllSSections('vacation')
    }
    public showTable() {
        this.isShowTable = true
    }
    private _confirm() {
        if (this.date.value) {
            this._loadingService.showLoading()
            this.isShowTable = false;
            let array = [];

            this.employees.forEach((data) => {
                let incomeArray = [];
                this.additions.forEach((addition) => {
                    let value = this.getEmployeesGroup(data, 'additions').get((addition.id).toString()).value;
                    incomeArray.push({ [addition.id]: value })
                })
                this.salaries.forEach((salary) => {
                    let value = this.getEmployeesGroup(data, 'salaries').get((salary.id).toString()).value;
                    incomeArray.push({ [salary.id]: value })
                })
                array.push({
                    employe_id: data.employeId,
                    income: incomeArray
                })
            })
            let sendObject = {
                year: this.date.value.getFullYear(),
                mouth: this.date.value.getMonth() + 1,
                employees: array

            }

            this._salariesService.sendSalary(sendObject).subscribe((data: ServerResponse<SalaryOperation[]>) => {
                this.operations = []
                data.data.forEach((element) => {
                    this.operations.push(this._fb.group({
                        debit: this._fb.control(this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, +element.debitId, 'id'), 0), Validators.required),
                        credit: this._fb.control(this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, +element.creditId, 'id'), 0), Validators.required),
                        amountInDram: this._fb.control(element.money, Validators.required),
                        comment: element.comment,
                        id: null
                    }))
                })
                this._loadingService.hideLoading()
            }, (err) => {
                this._mainService.translateServerError(err)
                this._loadingService.hideLoading()
            })
        }
    }
    public save() {
       this._confirm()

    }

    public getCheckboxFormControlName(additionOrHold): string {

        return ((additionOrHold.id).toString() + '+' + 'checkbox')
    }

    public getFormControlName(element, property: string = 'id'): string {
        return (element[property]).toString()
    }

    public getEmployeeAdditionFormControl(element, type: string): string {
        if (type == 'employee') {
            return (element.employeId).toString() + type
        } else {
            return (element.id).toString() + type
        }
    }
    public getEmployeesGroup(employee: SalaryEmployee | Employees, key: string, property: string = 'employeId') {
        return (this.salaryGroup.get((employee[property]).toString()).get(key))
    }
    public getBenefitsGroup(employee: SalaryEmployee, key: string, benefit) {

        return (this.salaryGroup.get((employee.employeId).toString()).get(key)).get((benefit.code).toString())
    }
    private _sendOperationOfSalary() {
        this._componentDataService.onClick();
        let salaryOperations: SalaryOperation[] = []
        this.operations.forEach((element) => {
            let value = element.value;
            salaryOperations.push({
                debitId: this._appService.checkProperty(value.debit, 'id'),
                creditId: this._appService.checkProperty(value.credit, 'id'),
                money: value.amountInDram,
                comment: value.comment
            })
        })
        let allAdditions = this.additions.concat(this.salaries);
        let employeesArray = []
        let allTaxibleWorker = 0;
        let allNoTaxableWorker = 0;
        let allNotParticipateSalary = 0
        this._allEmployees.forEach((data) => {
            let taxableWorker: number = 0;
            let noTaxableWorker: number = 0;
            let dirtySalary: number = 0;
            let participateSalary: number = 0;
            let notParticipateSalary: number = 0;
            let participateSalaryOfPart_12: number = 0
            let mergedAdditions = Object.assign(this.getEmployeesGroup(data, 'additions', 'id').value, this.getEmployeesGroup(data, 'salaries', 'id').value);
            allAdditions.forEach((addition) => {
                let value = mergedAdditions[(addition.id).toString()];
                dirtySalary += value
                if (addition.isIncome) {
                    taxableWorker += value
                } else {
                    noTaxableWorker += value
                }
                if (addition.typeOfVacation && addition.typeOfVacation.id) {
                    switch (addition.typeOfVacation.id) {
                        case 1: {
                            participateSalary += value
                            break;
                        }
                        case 2: {
                            notParticipateSalary += value
                            break;
                        }
                        case 3: {
                            participateSalaryOfPart_12 += value
                            break;
                        }

                    }
                }

            })

            let incomeTax = +taxableWorker * +this._provisions.taxfee / 100;
            let socialFee = +dirtySalary * +this._provisions.socialTaxfee / 100;
            let stampFee = (data.general.stampFee && data.general.stampFee == '1') ? +this._provisions.amountOfStampPayment : 0
            let cleanSalary = dirtySalary ? dirtySalary - incomeTax - socialFee - stampFee : 0
            employeesArray.push({
                employeeId: data.id,
                year: this.date.value.getFullYear(),
                monthOfSalary: this.date.value.getMonth() + 1,
                taxableWorker: taxableWorker,
                noTaxableWorker: noTaxableWorker,
                participateSalary: participateSalary,
                notParticipateSalary: notParticipateSalary,
                participateSalaryOfPart_12: participateSalaryOfPart_12,
                dirtySalary: dirtySalary,
                incomeTax: incomeTax,
                socialFee: socialFee,
                stampFee: stampFee,
                cleanSalary: cleanSalary
            })
            allTaxibleWorker += taxableWorker;
            allNoTaxableWorker += noTaxableWorker;
            allNotParticipateSalary += notParticipateSalary
        })

        let sendObject = {
            group: {
                taxableWorker: allTaxibleWorker,
                noTaxableWorker: allNoTaxableWorker,
                notParticipateSalary: allNotParticipateSalary,
                date: this.date.value ? this._datePipe.transform(this.date.value, 'yyyy-MM-dd') : this.date.value
            },
            employeSalary: employeesArray,
            salaryOperation: salaryOperations
        }

        this._loadingService.showLoading()
        this._salariesService.sendFinalSalary(sendObject).subscribe((data) => {
            this._loadingService.hideLoading()
            this.isSet = false;
            this.showTable();
            this.date.reset()
            this._messageService.add({ severity: 'success', summary: '', detail: 'Ձեր գործողությունները հաջողությամբ կատարված են' });
        }, (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading()
        })
    }
    public finalConfirm() {
        if (this._isExist) {
            let dialogRef = this._matDialog.open(ConfirmModal, {
                width: '700px',
                data: {
                    text: 'Այս ամսաթվով գործառնություն գոյություն ունի, ցանկանու՞մ եք այն փոփոխել',
                    link: this._existSalaryId
                }
            })
            dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                    this.delete(this._existSalaryId)
                }
            })
        } else {
            this._sendOperationOfSalary()
        }
    }

    public setYearRange() {
        return this._appService.setYearRange()
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe()
        this._loadingService.hideLoading();
    }

}
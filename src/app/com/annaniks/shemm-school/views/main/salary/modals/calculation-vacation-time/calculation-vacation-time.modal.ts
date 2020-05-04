import { Component, Inject } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectDocumentTypeModal } from 'src/app/com/annaniks/shemm-school/modals';
import { AppService, ComponentDataService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { AnalyticalGroup, AccountPlans, Partner, ModalDataModel, ServerResponse, DataCount, Employees, Provisions, AvarageSalaryForBenefit, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';
import { SalaryService } from '../../salary.service';

@Component({
    selector: 'calculation-vacation-time-modal',
    templateUrl: 'calculation-vacation-time.modal.html',
    styleUrls: ['calculation-vacation-time.modal.scss']
})
export class CalculationVacationTimeModal {
    public documentKind: Array<{ text: string, id: number }> = []
    public employees: Employees[] = []
    public title: string;
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public vacationTimeGroup: FormGroup;
    public activeTab: string;
    public provisions: Provisions;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private _subscription1: Subscription;
    public totalSum: number = 0;
    public dailySalary: number = 0
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Միջին աշխատավարձ', key: 'avarageSalary', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<CalculationVacationTimeModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        private _salaryService: SalaryService,
        private _messageService: MessageService,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }

    private _generateDocumentNumber(): Observable<ServerResponse<GenerateType>> {
        return this._salaryService.generateVacationDocumentNumber().pipe(
            map((data: ServerResponse<GenerateType>) => {
                this.vacationTimeGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
                this._loadingService.hideLoading()
                return data
            }, (err) => { this._loadingService.hideLoading() })
        )
    }
    private _setGeneralTabsValue(data, timeTable) {
        if (data.data.controls && data.data.controls.listArray && data.data.controls.listArray.controls) {
            timeTable['listArray'] = data.data.controls.listArray.controls
            this.vacationTimeGroup.get('general').setValue(timeTable);
        }
    }
    public getDailyCoefficient() {
        return this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'dailyCoefficient')
    }
    public getAvarageSalary($event) {
        if ($event) {
            this.totalSum = +$event.avarageMonth
            this.vacationTimeGroup.get('general').value.avarageSalary = this._appService.roundSum(+$event.avarageMonth);
            this.vacationTimeGroup.get('general').value.avarageDaily = this._appService.roundSum(+$event.avaragDaily)

        }
    }
    private _getDatesArray(startDate, employee) {
        if (startDate && employee) {
            let dateFormat = this._datePipe.transform(startDate, 'yyyy-MM-dd').toString()
            let avarageArray = [];
            let sum = 0
            this.totalSum = 0;
            let sumParticipateSalaryOfPart12 = 0;

            let date: Date = new Date(startDate.getFullYear(), startDate.getMonth());

            for (let i = 1; i <= 12; i++) {
                date.setMonth((startDate.getMonth()) - i);
                let year = (startDate.getMonth() - i < 0) ? startDate.getFullYear() - 1 : startDate.getFullYear()
                date.setFullYear(year)
                avarageArray.push(this._fb.group({
                    isConsider: true,
                    comment: "Տվյալներ չկան",
                    date: this._datePipe.transform(date, 'yyyy/MM'),
                    amount: 0,
                    monthPart: 0
                }))
            }

            this._loadingService.showLoading()
            this._salaryService.getLastYearSalaryByMonths(employee.id, dateFormat).subscribe((data: ServerResponse<AvarageSalaryForBenefit[]>) => {
                let salary = data.data;
                // salary.forEach((val) => {
                //     sum += val.sumParticipateSalary;
                //     sumParticipateSalaryOfPart12 += val.sumParticipateSalaryOfPart12;
                // })
                salary.forEach((val) => {
                    sum += val.sumParticipateSalary;
                    sumParticipateSalaryOfPart12 += val.sumParticipateSalaryOfPart12;
                    avarageArray.forEach((avarage: FormGroup) => {
                        if (this._datePipe.transform(new Date(val.year, val.monthOfSalary - 1), 'yyyy/MM') == avarage.value.date) {
                            avarage.get('amount').setValue(val.sumParticipateSalary)
                            avarage.get('monthPart').setValue(val.sumParticipateSalaryOfPart12)

                        }
                    })
                })

                this.totalSum = ((salary.length ? sum / avarageArray.length : 0) + sumParticipateSalaryOfPart12 / 12);

                this.vacationTimeGroup.get('avarageSalary').setValue(avarageArray);
                this._loadingService.hideLoading()

            },
                (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })

        }
    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {

                if (data.type == 'general' || data.type == 'general2') {
                    let timeTable = data.data.value;
                    this._setGeneralTabsValue(data, timeTable);
                    if (data.type == 'general2') {
                        this._getDatesArray(timeTable.startDate, this.vacationTimeGroup.get('employee').value)
                    }
                }
                else {
                    this.vacationTimeGroup.get(data.type).setValue(data.data);
                }
                for (let i = 0; i < this.tabsItem.length; i++) {
                    if (this.tabsItem[i].key == data.type) {
                        this.tabsItem[i].isValid = data.isValid
                    }
                }
            }
        })
    }
    public close() {
        this._dialogRef.close()

    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._mainService.getProvisions(),
            this._getEmployeesCount()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this.documentKind = this._appService.getDocumentKind();
            this.provisions = this._oftenUsedParams.getProvisions();

            this._getById()
            // this._loadingService.hideLoading()
        })
    }
    private _checkIsHasDate(value) {
        if (value) {
            let date = new Date(value);
            date.setHours(0);
            return date
        } else {
            return value
        }

    }
    private _getById() {
        if (this._data.id) {
            this._mainService.getById(this._urls.calculationVacationTimeGetOneUrl, this._data.id).subscribe((data: ServerResponse<any>) => {
                let vacation = data.data
                let middleSalary = []
                if (vacation.vacationMiddleSalary) {
                    let sum = 0
                    let sumParticipateSalaryOfPart12 = 0;
                    let countOfIsConsider = 0
                    vacation.vacationMiddleSalary.forEach((data) => {
                        if (data.esteem == 1) {
                            countOfIsConsider++
                        }
                        sum += data.money;
                        sumParticipateSalaryOfPart12 += data.partOf12;
                        middleSalary.push(this._fb.group({
                            isConsider: this._appService.getBooleanVariable(data.esteem),
                            comment: data.comment,
                            date: this._datePipe.transform(data.date, 'yyyy/MM'),
                            amount: data.money,
                            monthPart: data.partOf12

                        }))
                        this.totalSum = ((countOfIsConsider ? sum / countOfIsConsider : 0) + sumParticipateSalaryOfPart12 / 12);
                    })
                }
                let listArray = []
                vacation.vacationMonths.forEach((data) => {

                    listArray.push(this._fb.group({
                        monthName: this._appService.checkProperty(this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParams.monthNames, new Date(data.date).getMonth() + 1, 'id'), 0), 'name'),
                        date: new Date(data.date),
                        day: data.countOfDay,
                        amount: data.money
                    }))
                })


                let object = {}
                if (vacation && vacation.vacationMain && vacation.vacationMain.length) {
                    let vacationMain = vacation.vacationMain[0];
                    this._oftenUsedParams.setStartDate(this._datePipe.transform(this._appService.checkProperty(vacationMain, 'fromDate'), 'yyyy-MM-dd'))
                    this._oftenUsedParams.setEndDate(this._datePipe.transform(this._appService.checkProperty(vacationMain, 'toDate'), 'yyyy-MM-dd'))

                    object = {
                        old: true,
                        startDate: this._checkIsHasDate(this._appService.checkProperty(vacationMain, 'fromDate')),
                        endDate: this._checkIsHasDate(this._appService.checkProperty(vacationMain, 'toDate')),
                        avarageSalary: 0,
                        avarageDaily: 0,
                        expenseAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._appService.checkProperty(vacationMain, 'expenseAccountId'), 'id'), 0),
                        transitAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._appService.checkProperty(vacationMain, 'transitAccountId'), 'id'), 0),
                        fromEmployer: this._appService.checkProperty(vacationMain, 'fromEmployer'),
                        fromStateBudget: this._appService.checkProperty(vacationMain, 'fromStateBudget'),
                        dailyCoefficient: this._appService.checkProperty(vacationMain, 'middleDailyCoefficient'),
                        listArray: listArray
                    }
                }
                this.vacationTimeGroup.patchValue({
                    date: new Date(vacation.date),
                    folderNumber: vacation.documentNumber,
                    employee: vacation.employee,
                    analyticalGroup1: this._appService.checkProperty(this._appService.filterArray(this.analyticalGroup1, vacation.analiticGroup1Id, 'id'), 0),
                    analyticalGroup2: this._appService.checkProperty(this._appService.filterArray(this.analyticalGroup2, vacation.analiticGroup2Id, 'id'), 0),
                    comment: vacation.comment,
                    avarageSalary: middleSalary,
                    general: object

                })

                this._loadingService.hideLoading()

            })
        } else {
            this._generateDocumentNumber().subscribe();

        }
    }
    private _getEmployeesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.employeeMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getEmployees(data.data.count)
            })
        )
    }
    private _getEmployees(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
            map((data: ServerResponse<Employees[]>) => {
                this.employees = data.data;
            })
        )
    }

    private _validate() {
        this.vacationTimeGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            employee: [null, Validators.required],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null],
            avarageSalary: [null],
            general: [null]
        })
        this._combineObservable()
    }


    public save(): void {
        this._componentDataService.onClick();
        let paymentFromCurrentAccount = [];
        if (this.vacationTimeGroup.get('general') && this.vacationTimeGroup.get('general').value && this.vacationTimeGroup.get('general').value.listArray) {
            this.vacationTimeGroup.get('general').value.listArray.forEach((value, index) => {
                let element = value.value
                paymentFromCurrentAccount.push({
                    date: this._datePipe.transform(new Date(element.date), 'yyyy-MM-dd'),
                    index: index + 1,
                    countOfDay: element.day,
                    money: element.amount

                })
            })
        }
        let avarageSalaryArray = []
        if (this.vacationTimeGroup.get('avarageSalary') && this.vacationTimeGroup.get('avarageSalary').value) {
            this.vacationTimeGroup.get('avarageSalary').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getAvarageSalaryObject(this._datePipe, data)
                avarageSalaryArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.vacationTimeGroup);

        let sendObject = {

            date: this._datePipe.transform(this.vacationTimeGroup.get('date').value, 'yyyy-MM-dd'),
            documentNumber: this.vacationTimeGroup.get('folderNumber').value,
            employeeId: this._appService.checkProperty(this.vacationTimeGroup.get('employee').value, 'id'),
            analiticGroup_1Id: this._appService.checkProperty(this.vacationTimeGroup.get('analyticalGroup1').value, 'id'),
            analiticGroup_2Id: this._appService.checkProperty(this.vacationTimeGroup.get('analyticalGroup2').value, 'id'),
            comment: this.vacationTimeGroup.get('comment').value,
            vacationMain: [{
                fromDate: this._datePipe.transform(this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'startDate'), 'yyyy-MM-dd'),
                toDate: this._datePipe.transform(this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'endDate'), 'yyyy-MM-dd'),
                middleDailyCoefficient: this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'dailyCoefficient').toString(),
                expenseAccountId: this._appService.checkProperty(this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'expenseAccount'), 'id'),
                transitAccountId: this._appService.checkProperty(this._appService.checkProperty(this.vacationTimeGroup.get('general').value, 'transitAccount'), 'id'),
            }],
            vacationMiddleSalary: avarageSalaryArray,
            vacationMonths: paymentFromCurrentAccount
        }

        if (this.vacationTimeGroup.valid) {
            this._loadingService.showLoading()
            if (!this._data.id) {
                this._add(sendObject)
            } else {
                this._mainService.deleteByUrl(this._urls.calculationVacationTimeGetOneUrl, this._data.id).subscribe(() => {
                    this._add(sendObject)
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            }
        } else {
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.vacationTimeGroup)
        }
    }
    private _add(sendObject) {
        this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
            this._componentDataService.offClick();
            this._dialogRef.close({ value: true })
            this._loadingService.hideLoading()
        }, (err) => {
            this._mainService.translateServerError(err)
            this._loadingService.hideLoading()
        })
    }
    public getActiveTab(event): void {
        this._componentDataService.onClick()
        this.activeTab = event.title;
    }

    public setTodayDate(): Date {
        let today = new Date();
        return today
    }
    public setValue(event, controlName: string): void {
        this.vacationTimeGroup.get(controlName).setValue(event);
        this.onFocus(this.vacationTimeGroup, controlName)
        if (controlName == 'employee') {
            if (event && event.id) {
                if (this.vacationTimeGroup.get('general').value)
                    this._getDatesArray(this.vacationTimeGroup.get('general').value.startDate,
                        this.vacationTimeGroup.get('employee').value)
            }
        }
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.vacationTimeGroup, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    public setModalParams2(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }
    ngOnDestroy() {
        this._oftenUsedParams.setStartDate(null)
        this._oftenUsedParams.setEndDate(null)
        this._loadingService.hideLoading()
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe();
    }
    get error(): string {
        return this._error
    }

}
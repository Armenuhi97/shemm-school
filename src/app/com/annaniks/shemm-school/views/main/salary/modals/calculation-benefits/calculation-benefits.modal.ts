import { Component, Inject, Output, EventEmitter } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AnalyticalGroup, Partner, AccountPlans, ModalDataModel, ServerResponse, DataCount, Employees, JsonObjectType, AvarageSalaryForBenefit, Provisions, GenerateType, Benefits, Benefit } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { SelectDocumentTypeModal } from 'src/app/com/annaniks/shemm-school/modals';
import { switchMap, map } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';
import { SalaryService } from '../../salary.service';


@Component({
    selector: 'calculation-benefits-modal',
    templateUrl: 'calculation-benefits.modal.html',
    styleUrls: ['calculation-benefits.modal.scss']
})
export class CalculationBenefitsModal {
    public listArray = [];
    public provisions: Provisions;
    public totalSum: number = 0
    public documentKind: Array<{ text: string, id: number }> = []
    public avarageSalary: { avarageMonth: number, avaragDaily: number };
    public employees: Employees[] = []
    public title: string;
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public benefitsGroup: FormGroup;
    public activeTab: string;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private _subscription1: Subscription;
    public benefits: JsonObjectType[] = []
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Միջին աշխատավարձ', key: 'avarageSalary', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<CalculationBenefitsModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _messageService: MessageService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        private _salaryService: SalaryService,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }
    private _generateDocumentNumber(): Observable<ServerResponse<GenerateType>> {
        return this._salaryService.generateBenefitDocumentNumber().pipe(
            map((data: ServerResponse<GenerateType>) => {
                this.benefitsGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
                this._loadingService.hideLoading()
                return data
            },(err)=>{this._loadingService.hideLoading()})
        )
    }
    public getDailyCoefficient() {
        return this._appService.checkProperty(this.benefitsGroup.get('general').value, 'dailyCoefficient')
    }
    private _checkIsHasDate(value) {
        // return value ? new Date(value) : value
        if (value) {
            let date = new Date(value);
            date.setHours(0);
            return date
        } else {
            return value
        }
    }
    private _getDatesArray(startDate, employee) {
        if (startDate && employee) {
            let dateFormat = this._datePipe.transform(startDate, 'yyyy-MM-dd').toString()
            let avarageArray = [];
            this.totalSum = 0
            let date: Date = new Date(startDate.getFullYear(), startDate.getMonth())
            for (let i = 0; i <= 11; i++) {
                date.setMonth((startDate.getMonth()) - i);
                let year = (startDate.getMonth() - i < 0) ? startDate.getFullYear() - 1 : startDate.getFullYear()
                date.setFullYear(year)
                avarageArray.push(this._fb.group({
                    isConsider: true,
                    comment: "Տվյալներ չկան",
                    date: this._datePipe.transform(new Date(date), 'yyyy/MM'),
                    amount: 0
                }))
            }
            this._loadingService.showLoading()
            this._salaryService.getLastYearSalaryByMonths(employee.id, dateFormat).subscribe((data: ServerResponse<AvarageSalaryForBenefit[]>) => {
                let salary = data.data;
                salary.forEach((val) => {
                    this.totalSum += val.sumParticipateSalary;
                    avarageArray.forEach((avarage: FormGroup) => {
                        if (this._datePipe.transform(new Date(val.year, val.monthOfSalary - 1), 'yyyy/MM') == avarage.value.date) {
                            avarage.get('amount').setValue(val.sumParticipateSalary)

                        }
                    })
                })

                this.benefitsGroup.get('avarageSalary').setValue(avarageArray);
                this._loadingService.hideLoading()

            },
                (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
        }
    }

    private _setGeneralTabsValue(data, timeTable) {
        if (data.data.controls && data.data.controls.listArray && data.data.controls.listArray.controls) {
            timeTable['listArray'] = data.data.controls.listArray.controls
            this.benefitsGroup.get('general').setValue(timeTable);
        }
    }
    public getAvarageSalary($event) {
        if ($event) {
            this.totalSum = this._appService.roundSum(+$event.avarageMonth * 12)

            this.benefitsGroup.get('general').value.avarageSalary = this._appService.roundSum(+$event.avarageMonth)
            this.benefitsGroup.get('general').value.avarageDaily = this._appService.roundSum(+$event.avaragDaily)

        }
    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'general' || data.type == 'general2') {
                    let timeTable = data.data.value;

                    this._setGeneralTabsValue(data, timeTable);
                    if (data.type == 'general2') {
                        this._getDatesArray(timeTable.startDate, this.benefitsGroup.get('employee').value)
                    }
                } else {
                    this.benefitsGroup.get(data.type).setValue(data.data);
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
            this._mainService.getBenefits(),
            this._mainService.getProvisions(),
            this._getEmployeesCount()
        )
        this._subscription = combine.subscribe((data) => {

            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this.documentKind = this._appService.getDocumentKind()
            this.benefits = this._oftenUsedParams.getBenefit();
            this.provisions = this._oftenUsedParams.getProvisions();
            this._getById()
            // this._loadingService.hideLoading()
        })
    }
    private _getById() {
        if (this._data.id) {
            this._mainService.getById(this._urls.calculateBenefitsGetOneUrl, this._data.id).subscribe((data: ServerResponse<Benefit>) => {
                let benefit = data.data;
                let middleSalary = []
                if (benefit.middleSalary) {
                    this.totalSum = 0
                    benefit.middleSalary.forEach((data) => {
                        this.totalSum += data.money;
                        middleSalary.push(this._fb.group({
                            isConsider: this._appService.getBooleanVariable(data.esteem),
                            comment: data.comment,
                            date: this._datePipe.transform(data.date, 'yyyy/MM'),
                            amount: data.money
                        }))
                    })
                }
                if (benefit.benefitMain) {
                    let listArray = [];
                    let array = JSON.parse(benefit.benefitMain.otherInformation);
                    array.forEach((data) => {
                        listArray.push(this._fb.group(data))
                    })
                    this._oftenUsedParams.setStartDate(this._datePipe.transform(this._appService.checkProperty(benefit.benefitMain, 'fromDate'), 'yyyy-MM-dd'))
                    this._oftenUsedParams.setEndDate(this._datePipe.transform(this._appService.checkProperty(benefit.benefitMain, 'toDate'), 'yyyy-MM-dd'))
                    this.benefitsGroup.patchValue({
                        general: {
                            old: true,
                            startDate: this._checkIsHasDate(this._appService.checkProperty(benefit.benefitMain, 'fromDate')),
                            endDate: this._checkIsHasDate(this._appService.checkProperty(benefit.benefitMain, 'toDate')),
                            avarageSalary: 0,
                            avarageDaily: 0,
                            expenseAccount: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, this._appService.checkProperty(benefit.benefitMain, 'expenseAccountId'), 'id'), 0),
                            listArray: listArray,
                            dailyCoefficient: this._appService.checkProperty(benefit.benefitMain, 'middleDailyCoefficient'),
                        }
                    })
                }
                this.benefitsGroup.patchValue({
                    date: new Date(benefit.date),
                    folderNumber: benefit.documentNumber,
                    benefit: this._appService.checkProperty(this._appService.filterArray(this.benefits, benefit.benefit, 'name'), 0),
                    employee: benefit.employee,
                    analyticalGroup1: this._appService.checkProperty(this._appService.filterArray(this.analyticalGroup1, benefit.analiticGroup1Id, 'id'), 0),
                    analyticalGroup2: this._appService.checkProperty(this._appService.filterArray(this.analyticalGroup2, benefit.analiticGroup2Id, 'id'), 0),
                    comment: benefit.comment,
                    avarageSalary: middleSalary,

                })
                this._loadingService.hideLoading()

            })
        } else {
            this._generateDocumentNumber().subscribe()
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
        this.benefitsGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            benefit: [null, Validators.required],
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
        let fromEmployer = 0;
        let fromStateBudget = 0;
        let otherInformation = ''
        if (this.benefitsGroup.get('general') && this.benefitsGroup.get('general').value && this.benefitsGroup.get('general').value.listArray) {
            let listArray = []
            this.benefitsGroup.get('general').value.listArray.forEach((data) => {
                listArray.push(data.value)
            })
            otherInformation = JSON.stringify(listArray)

            if (this.benefitsGroup.get('benefit').value && this.benefitsGroup.get('benefit').value.code !== 946) {
                this.benefitsGroup.get('general').value.listArray.forEach((value) => {
                    if (value.value.id == 1) {
                        fromEmployer = value.value.amount
                    } else {
                        fromStateBudget = value.value.amount
                    }
                })
            } else {
                fromEmployer = 0
                fromStateBudget = this.benefitsGroup.get('general').value.totalamount


            }
        }

        let avarageSalaryArray = []
        if (this.benefitsGroup.get('avarageSalary') && this.benefitsGroup.get('avarageSalary').value) {
            this.benefitsGroup.get('avarageSalary').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getAvarageSalaryObject(this._datePipe, data)
                avarageSalaryArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.benefitsGroup);

        let sendObject = {
            date: this._datePipe.transform(this.benefitsGroup.get('date').value, 'yyyy-MM-dd'),
            documentNumber: this.benefitsGroup.get('folderNumber').value,
            benefit: this._appService.checkProperty(this.benefitsGroup.get('benefit').value, 'name'),
            employeeId: this._appService.checkProperty(this.benefitsGroup.get('employee').value, 'id'),
            analiticGroup_1Id: this._appService.checkProperty(this.benefitsGroup.get('analyticalGroup1').value, 'id'),
            analiticGroup_2Id: this._appService.checkProperty(this.benefitsGroup.get('analyticalGroup2').value, 'id'),
            comment: this.benefitsGroup.get('comment').value,
            benefitMain: [{
                fromDate: this._datePipe.transform(this._appService.checkProperty(this.benefitsGroup.get('general').value, 'startDate'), 'yyyy-MM-dd'),
                toDate: this._datePipe.transform(this._appService.checkProperty(this.benefitsGroup.get('general').value, 'endDate'), 'yyyy-MM-dd'),
                expenseAccountId: this._appService.checkProperty(this._appService.checkProperty(this.benefitsGroup.get('general').value, 'expenseAccount'), 'id'),
                fromEmployer: fromEmployer,
                fromStateBudget: fromStateBudget,
                middleDailyCoefficient: this._appService.checkProperty(this.benefitsGroup.get('general').value, 'dailyCoefficient').toString(),
                otherInformation: otherInformation
            }],
            middleSalary: avarageSalaryArray,

        }

        if (this.benefitsGroup.valid) {
            this._loadingService.showLoading()
            if (!this._data.id) {
                this.add(sendObject)
            } else {
                this._mainService.deleteByUrl(this._urls.calculateBenefitsGetOneUrl, this._data.id).subscribe((data) => {
                    if (data)
                        this.add(sendObject)
                },
                    (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })

            }
        } else {
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.benefitsGroup)
        }
    }
    public add(sendObject) {
        this._mainService.addByUrl(this._urls.calculateBenefitsGetOneUrl, sendObject).subscribe((data) => {
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
        this.benefitsGroup.get(controlName).setValue(event);
        this.onFocus(this.benefitsGroup, controlName);
        if (controlName == 'employee') {
            if (event && event.id) {
                if (this.benefitsGroup.get('general').value)
                    this._getDatesArray(this.benefitsGroup.get('general').value.startDate,
                        this.benefitsGroup.get('employee').value)
            }

        }
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.benefitsGroup, controlName, property)
    }
    public setModalParams(title: string, property: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public setModalParams2(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    ngOnDestroy() {
        this._oftenUsedParams.setStartDate(null)
        this._oftenUsedParams.setEndDate(null)
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe();
        this._loadingService.hideLoading()
    }

}
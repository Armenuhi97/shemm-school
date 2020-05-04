import { Component, Inject } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectEmployeeModal } from '../select-employees/select-employees.modal';
import { LoadingService, AppService, ComponentDataService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { AccountPlans, Partner, AnalyticalGroup, Provisions, ServerResponse, Employees, DataCount, AvarageSalaryForBenefit, ModalDataModel } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';
import { map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'finaly-settlement-modal',
    templateUrl: 'finaly-settlement.modal.html',
    styleUrls: ['finaly-settlement.modal.scss']
})
export class FinalySettlementModal {
    private _error: string
    public title: string;
    public employees: Employees[] = []
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    public finalySettlementGroup: FormGroup;
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Միջին աշխատավարձ', key: 'avarageSalary', isValid: true }]
    public activeTab: string;
    public provisions: Provisions;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private _subscription1: Subscription;
    constructor(private _dialogRef: MatDialogRef<FinalySettlementModal>,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        @Inject(MAT_DIALOG_DATA) private _data:ModalDataModel,
        private _fb: FormBuilder,
        private _loadingService: LoadingService,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _datePipe: DatePipe,
        private _messageService: MessageService,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()
    }

    ngOnInit() {
        this._setDataFromTabs()
    }
    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                this.finalySettlementGroup.get(data.type).setValue(data.data);
                for (let i = 0; i < this.tabsItem.length; i++) {
                    if (this.tabsItem[i].key == data.type) {
                        this.tabsItem[i].isValid = data.isValid
                    }
                }
            }
        })
    }
    private _getDatesArray(startDate, employee) {
        if (startDate && employee) {
            let dateFormat = this._datePipe.transform(startDate, 'yyyy-dd-MM').toString()
            let avarageArray = [];
            let sum = 0
            // this.totalSum = 0;
            let sumParticipateSalaryOfPart12 = 0;

            let date: Date = new Date(startDate.getFullYear(), startDate.getMonth())
            for (let i = 1; i <= 12; i++) {
                date.setDate((startDate.getMonth()) - i);
                avarageArray.push(this._fb.group({
                    isConsider: true,
                    comment: "Տվյալներ չկան",
                    date: this._datePipe.transform(new Date(date), 'yyyy/MM'),
                }))
            }
            this._loadingService.showLoading()
            this._mainService.getByUrlWithoutLimit(`salariesByEmployee/${employee.id}/${dateFormat}`).subscribe((data: ServerResponse<AvarageSalaryForBenefit[]>) => {
                let salary = data.data;
         
                salary.forEach((val) => {
                    sum += val.sumParticipateSalary;
                    sumParticipateSalaryOfPart12 += val.sumParticipateSalaryOfPart12;
                })
                avarageArray.forEach((avarage: FormGroup) => {
                    if (salary.length) {
                        salary.forEach((val) => {

                            if (avarage.value.date == this._datePipe.transform(new Date(val.year,val.monthOfSalary), 'yyyy/MM')) {
                                avarage.addControl('amount', this._fb.control(val.sumParticipateSalary));
                                avarage.addControl('monthPart', this._fb.control(val.sumParticipateSalaryOfPart12));
                            } else {
                                avarage.addControl('amount', this._fb.control(0));
                                avarage.addControl('monthPart', this._fb.control(0));
                            }
                        })

                    } else {
                        avarage.addControl('amount', this._fb.control(0));
                        avarage.addControl('monthPart', this._fb.control(0));
                    }
                })

                // this.totalSum = ((salary.length?sum/salary.length:0) + sumParticipateSalaryOfPart12) / 12;                
                this.finalySettlementGroup.get('avarageSalary').setValue(avarageArray);

                this._loadingService.hideLoading()

            },
                (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })

        }
    }

    public close() {
            this._dialogRef.close()
    }
    public getActiveTab(event): void {
        this._componentDataService.onClick()
        this.activeTab = event.title;
    }
    private _validate() {
        this.finalySettlementGroup = this._fb.group({
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            employee: [null, Validators.required],
            analyticalGroup1: [null, Validators.required],
            analyticalGroup2: [null, Validators.required],
            comment: [null],
            general: [null],
            avarageSalary: [null]
        })
        this._combineObservable()
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
            this.provisions = this._oftenUsedParams.getProvisions()
            this._loadingService.hideLoading()
        })
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
    public setTodayDate(): Date {
        let today = new Date();
        return today
    }
    public setValue(event, controlName: string): void {
        this.finalySettlementGroup.get(controlName).setValue(event);
        this.onFocus(this.finalySettlementGroup, controlName)
        // if (controlName == 'employee') {
        //     if (event && event.id) {
        //         if (this.finalySettlementGroup.get('general').value)
        //             this._getDatesArray(this.finalySettlementGroup.get('general').value.startDate,
        //                 this.finalySettlementGroup.get('employee').value)
        //     }
        // }
    }
    public save(){
        this._componentDataService.onClick();
   

        let avarageSalaryArray = []
        if (this.finalySettlementGroup.get('avarageSalary') && this.finalySettlementGroup.get('avarageSalary').value) {
            this.finalySettlementGroup.get('avarageSalary').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getAvarageSalaryObject(this._datePipe, data)
                avarageSalaryArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.finalySettlementGroup);

        let sendObject = {

            date: this._datePipe.transform(this.finalySettlementGroup.get('date').value, 'yyyy-MM-dd'),
            documentNumber: this.finalySettlementGroup.get('folderNumber').value,
            employeeId: this._appService.checkProperty(this.finalySettlementGroup.get('employee').value, 'id'),
            analiticGroup_1Id: this._appService.checkProperty(this.finalySettlementGroup.get('analyticalGroup1').value, 'id'),
            analiticGroup_2Id: this._appService.checkProperty(this.finalySettlementGroup.get('analyticalGroup2').value, 'id'),
            comment: this.finalySettlementGroup.get('comment').value,
            vacationMain: [{
                fromDate: this._datePipe.transform(this._appService.checkProperty(this.finalySettlementGroup.get('general').value, 'startDate'), 'yyyy-MM-dd'),
                toDate: this._datePipe.transform(this._appService.checkProperty(this.finalySettlementGroup.get('general').value, 'endDate'), 'yyyy-MM-dd'),
                middleDailyCoefficient: this._appService.checkProperty(this.finalySettlementGroup.get('general').value, 'dailyCoefficient').toString(),
                expenseAccountId: this._appService.checkProperty(this._appService.checkProperty(this.finalySettlementGroup.get('general').value, 'expenseAccount'), 'id'),
                transitAccountId: this._appService.checkProperty(this._appService.checkProperty(this.finalySettlementGroup.get('general').value, 'transitAccount'), 'id'),
            }],
            vacationMiddleSalary: avarageSalaryArray,
            // vacationMonths: paymentFromCurrentAccount
        }
        console.log(sendObject);

        if (this.finalySettlementGroup.valid) {
            this._loadingService.showLoading()
            if (!this._data.id) {
                this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                    this._componentDataService.offClick();
                    this._dialogRef.close({ value: true })
                    this._loadingService.hideLoading()
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            } else {
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe(() => {
                    this._componentDataService.offClick()
                    this._dialogRef.close({ value: true, id: this._data.id });
                    this._loadingService.hideLoading()
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                })
            }
        } else {
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.finalySettlementGroup)
        }
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.finalySettlementGroup, controlName, property)
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
    ngOnDestroy() {
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe();
        this._loadingService.hideLoading()
    }
    get getModalName() {
        return SelectEmployeeModal
    }

}
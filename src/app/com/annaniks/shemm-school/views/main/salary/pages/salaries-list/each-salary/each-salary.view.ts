import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../../main.service';
import { LoadingService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { DatePipe } from '@angular/common';
import { ServerResponse, Salary, AnalyticalGroup, Partner, AccountPlans, Employees, EmployeeSalary } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map } from 'rxjs/operators';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
    selector: 'each-salary-view',
    templateUrl: 'each-salary.view.html',
    styleUrls: ['each-salary.view.scss']
})
export class EachSalaryView {
    private _id: number;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    private routeSub: Subscription;
    public employeeSalary;
    public employees: Employees[] = []
    public operations = [];
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    constructor(private _activatedRoute: ActivatedRoute,
        @Inject('URL_NAMES') private _urls,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _loadingService: LoadingService,
        private _mainService: MainService,
        private _appService: AppService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe) {
        this.routeSub = this._activatedRoute.params.subscribe(params => {
            this._id = params['id']
        });
    }
    ngOnInit() {

        this._combineObservable()
    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._mainService.getEmployeesCount()

        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this.partners = this._oftenUsedParamsService.getPartners();
            this.chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this.employees = this._oftenUsedParamsService.getEmployees()
            this._getSalaryById()
        })
    }
    private _getSalaryById(): void {
        this._mainService.getById(this._urls.groupSalariesGetOneUrl, this._id).subscribe((data: ServerResponse<Salary>) => {
            this.employeeSalary = data.data.employeSalary;
            this.operations = []
            data.data.salaryOperation.forEach(element => {
                this.operations.push(this._fb.group({
                    debit: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, element.debitId, 'id'), 0),
                    credit: this._appService.checkProperty(this._appService.filterArray(this.chartAccounts, element.creditId, 'id'), 0),
                    amountInDram: element.money,
                    comment: element.comment
                }))
            })
            this._loadingService.hideLoading()
        })

    }
    public getEmployeeName(id: number) {
        let employee = this._appService.checkProperty(this._appService.filterArray(this.employees, id, 'id'), 0);
        return employee ? employee.fullName : null

    }
    public setDate(month, year) {
        if (month && year) {
            return this._datePipe.transform(new Date(year, month), 'yyyy/MM')
        } else {
            return null
        }

    }
    ngOnDestroy() {
        this.routeSub.unsubscribe();
        this._subscription.unsubscribe();
        this._loadingService.hideLoading()
    }
}
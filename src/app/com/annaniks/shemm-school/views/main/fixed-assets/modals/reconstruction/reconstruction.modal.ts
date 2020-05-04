import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortModel, AnalyticalGroup, Partner, AccountPlans, MaterialValues, ModalDataModel, ServerResponse, DataCount, Employees } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { switchMap, map } from 'rxjs/operators';
import { SelectDocumentTypeModal } from 'src/app/com/annaniks/shemm-school/modals';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'reconstruction-modal',
    templateUrl: 'reconstruction.modal.html',
    styleUrls: ['reconstruction.modal.scss']
})
export class ReconstructionModal {
    public title: string;
    public employees: Employees[] = []
    public documentKind: Array<{ text: string, id: number }> = []
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private _error: string;
    public subdivisions: ShortModel[] = []
    public formGroup: FormGroup;
    public activeTab: string;
    private _subscription: Subscription;
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    public partners: Partner[] = [];
    public chartAccounts: AccountPlans[] = []
    public unitOfMeasurements: MaterialValues[] = [];
    private _subscription1: Subscription;
    private _lastProduct;
    private _products;
    public tabsItem = [
        { title: 'Ընդհանուր', key: 'general', isValid: true },
        { title: 'Գործառնություններ', key: 'operation', isValid: true }]
    constructor(private _dialogRef: MatDialogRef<ReconstructionModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _messageService: MessageService,
        private _oftenUsedParams: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _datePipe: DatePipe,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()
        this.documentKind = this._appService.getDocumentKind()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }
    private setCommonInfo(data) {
        let object = {}
        if (data) {
            if (this._data.type == 1) {
                object = {
                    taxResidualUsefulLifeOld: this._appService.checkProperty(data, 'taxResidualUsefulLifeOld'),
                    taxResidualUsefulLifeNew: this._appService.checkProperty(data, 'taxResidualUsefulLifeNew'),
                    taxInitialCostOld: this._appService.checkProperty(data, 'taxInitialCostOld'),
                    taxInitialCostNew: this._appService.checkProperty(data, 'taxInitialCostNew'),
                    revenueResidualUsefulLifeOld: this._appService.checkProperty(data, 'revenueResidualUsefulLifeOld'),
                    revenueResidualUsefulLifeNew: this._appService.checkProperty(data, 'revenueResidualUsefulLifeNew'),
                    revenueInitialCostOld: this._appService.checkProperty(data, 'revenueInitialCostOld'),
                    revenueInitialCostNew: this._appService.checkProperty(data, 'revenueInitialCostNew'),
                    financeResidualUsefulLifeOld: this._appService.checkProperty(data, 'financeResidualUsefulLifeOld'),
                    financeResidualUsefulLifeNew: this._appService.checkProperty(data, 'financeResidualUsefulLifeNew'),
                    financeInitialCostOld: this._appService.checkProperty(data, 'financeInitialCostOld'),
                    financeInitialCostNew: this._appService.checkProperty(data, 'financeInitialCostNew')
                }
            } else {
                if (this._data.type == 0) {
                    object = {
                        taxResidualUsefulLifeOld: this._appService.checkProperty(data, 'taxResidualUsefulLifeOld'),
                        taxResidualUsefulLifeNew: this._appService.checkProperty(data, 'taxResidualUsefulLifeNew'),
                        taxInitialCostOld: this._appService.checkProperty(data, 'taxInitialCostOld'),
                        taxInitialCostNew: this._appService.checkProperty(data, 'taxInitialCostNew'),
                        taxCalculatedWearOld: this._appService.checkProperty(data, 'taxCalculatedWearOld'),
                        taxCalculatedWearNew: this._appService.checkProperty(data, 'taxCalculatedWearNew'),
                        taxResidualValueOld: this._appService.checkProperty(data, 'taxResidualValueOld'),
                        taxResidualValueNew: this._appService.checkProperty(data, 'taxResidualValueNew'),
                        revenueResidualUsefulLifeOld: this._appService.checkProperty(data, 'revenueResidualUsefulLifeOld'),
                        revenueResidualUsefulLifeNew: this._appService.checkProperty(data, 'revenueResidualUsefulLifeNew'),
                        revenueInitialCostOld: this._appService.checkProperty(data, 'revenueInitialCostOld'),
                        revenueInitialCostNew: this._appService.checkProperty(data, 'revenueInitialCostNew'),
                        revenueCalculatedWearOld: this._appService.checkProperty(data, 'revenueCalculatedWearOld'),
                        revenueCalculatedWearNew: this._appService.checkProperty(data, 'revenueCalculatedWearNew'),
                        revenueResidualValueOld: this._appService.checkProperty(data, 'revenueResidualValueOld'),
                        revenueResidualValueNew: this._appService.checkProperty(data, 'revenueResidualValueNew'),
                        financeResidualUsefulLifeOld: this._appService.checkProperty(data, 'financeResidualUsefulLifeOld'),
                        financeResidualUsefulLifeNew: this._appService.checkProperty(data, 'financeResidualUsefulLifeNew'),
                        financeInitialCostOld: this._appService.checkProperty(data, 'financeInitialCostOld'),
                        financeInitialCostNew: this._appService.checkProperty(data, 'financeInitialCostNew'),
                        financeCalculatedWearOld: this._appService.checkProperty(data, 'financeCalculatedWearOld'),
                        financeCalculatedWearNew: this._appService.checkProperty(data, 'financeCalculatedWearNew'),
                        financeResidualValueOld: this._appService.checkProperty(data, 'financeResidualValueOld'),
                        financeResidualValueNew: this._appService.checkProperty(data, 'financeResidualValueNew')
                    }
                }
            }
        }
        return object
    }
    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.reconstructionFunctionUrl, body, this.formGroup, this._fb, this.tabsItem)
    }

    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'general') {

                    if (data.data) {
                        this._products = this.setCommonInfo(data.data);

                        if (!(this._products == this._lastProduct)) {
                            this._getOperationArray(this._products)
                        }
                        this._lastProduct = this.setCommonInfo(data.data)
                    }
                }

                this.formGroup.get(data.type).setValue(data.data);

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

            this._mainService.getMaterialValues(),
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._getSubdivisionCount(),
            this._getEmployeesCount()
        )
        this._subscription = combine.subscribe((data) => {
            this.analyticalGroup1 = this._oftenUsedParams.getAnalyticalGroup1();
            this.analyticalGroup2 = this._oftenUsedParams.getAnalyticalGroup2()
            this.partners = this._oftenUsedParams.getPartners();
            this.chartAccounts = this._oftenUsedParams.getChartAccounts();
            this.unitOfMeasurements = this._oftenUsedParams.getMaterialValues();
            this._loadingService.hideLoading()
        })
    }
    private _getSubdivisionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.subdivisionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getSubdivisions(data.data.count)
            })
        )
    }
    private _getSubdivisions(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.subdivisionMainUrl, count, 0).pipe(
            map((data: ServerResponse<ShortModel[]>) => {
                this.subdivisions = data.data;
            })
        )
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
        this.formGroup = this._fb.group({
            location: [null],
            materialAswer: [null],
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null],
            propertyNumber: [null, Validators.required],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            comment: [null],
            operation: [null],
            general: [null]
        })
        this._combineObservable()
    }


    public save(): void {
        this._componentDataService.onClick();
        let operationArray = []
        if (this.formGroup.get('operation') && this.formGroup.get('operation').value) {
            this.formGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.formGroup);
        let generalObject = this.setCommonInfo(this.formGroup.get('general').value)
        let mainObject = {
            location: this._appService.checkProperty(this.formGroup.get('location').value, 'id'),
            materialAswer: this._appService.checkProperty(this.formGroup.get('materialAswer').value, 'id'),
            propertyNumber: this.formGroup.get('propertyNumber').value,
            date: this._datePipe.transform(this.formGroup.get('date').value, 'yyyy-MM-dd'),
            folderNumber: this.formGroup.get('folderNumber').value,
            analyticalGroup1Id: this._appService.checkProperty(this.formGroup.get('analyticalGroup1').value, 'id'),
            analyticalGroup2Id: this._appService.checkProperty(this.formGroup.get('analyticalGroup2').value, 'id'),
            comment: this.formGroup.get('comment').value,
            operation: operationArray
        }

        let sendObject = Object.assign(generalObject, mainObject);
        console.log(sendObject);

        if (this.formGroup.valid) {
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
            this.tabsItem = this._appService.setInvalidButton(this.tabsItem, this.formGroup)
        }
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
        this.formGroup.get(controlName).setValue(event);
        this.onFocus(this.formGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.formGroup, controlName, property)
    }

    public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
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
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe();
        this._loadingService.hideLoading()
    }
    get error(): string {
        return this._error
    }
    get type(): number {
        return this._data.type
    }
}
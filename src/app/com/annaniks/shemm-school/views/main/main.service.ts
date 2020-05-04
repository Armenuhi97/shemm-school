import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse, DataCount, AccountPlans, MaterialValues, Partner, WareHouse, AnalyticalGroup, OperationModel, TabItem, Services, JsonObjectType, Provisions, Employees, BankPayload, Currency } from '../../models/global.models';
import { map, switchMap } from 'rxjs/operators';
import { OftenUsedParamsService, AppService, ComponentDataService, LoadingService } from '../../services';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api/';
import { Http } from '@angular/http'
@Injectable()
export class MainService {
    private _isAutorized: string = 'isAuthorized';

    constructor(private _httpClient: HttpClient,
        @Inject('URL_NAMES') private _urls,
        private _messageService: MessageService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _componentDateService: ComponentDataService,
        private _http: Http,
        private _loadingService: LoadingService,
        private _appService: AppService) { }

    public addByUrl(url: string, body) {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.post<any>(url, body, { params })
    }
    public deleteByUrl(url: string, id: number) {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.delete<any>(`${url}/${id}`, { params })
    }
    public getByUrl(url: string, limit: number, offset: number): Observable<ServerResponse<Object>> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.get<any>(`${url}/${limit}/${offset}`, { params })
    }
    public getByUrlWithoutLimit(url: string): Observable<ServerResponse<Object>> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.get<any>(`${url}`, { params })
    }
    public getById(url: string, id: number): Observable<ServerResponse<Object>> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.get<ServerResponse<Object>>(`${url}/${id}`, { params })
    }
    public updateByUrl(url: string, id: number, body: any) {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.put<any>(`${url}/${id}`, body, { params })
    }
    public updateJsonByUrl(url: string, body: any): Observable<any> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.put<any>(`${url}`, body, { params })
    }

    public getCount(url: string): Observable<ServerResponse<DataCount>> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.get<ServerResponse<DataCount>>(`${url}`, { params })
    }
    public getAccountsPlan(): Observable<ServerResponse<AccountPlans[]>> {
        return this.getByUrl(this._urls.accountPlanMainUrl, 0, 0).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this._oftenUsedParamsService.setChartAccounts(data.data);
                return data
            })
        )
    }
    public getMaterialValues(): Observable<ServerResponse<MaterialValues[]>> {
        return this.getByUrl(this._urls.materialValuesOrderMainUrl, 0, 0).pipe(
            map((data: ServerResponse<MaterialValues[]>) => {
                this._oftenUsedParamsService.setMaterialValues(data.data)
                return data
            })
        )
    }
    public getPartnerCount(): Observable<void> {
        return this.getCount(this._urls.partnerMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getPartner(data.data.count)
            })
        )
    }
    private _getPartner(count: number): Observable<void> {
        return this.getByUrl(this._urls.partnerMainUrl, count, 0).pipe(
            map((data: ServerResponse<Partner[]>) => {
                this._oftenUsedParamsService.setPartners(data.data)
            })
        )
    }

    public getWarehouseCount(): Observable<void> {
        return this.getCount(this._urls.warehouseMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getWarehouses(data.data.count)
            })
        )
    }
    private _getWarehouses(count: number): Observable<void> {
        return this.getByUrl(this._urls.warehouseMainUrl, count, 0).pipe(
            map((data: ServerResponse<WareHouse[]>) => {
                this._oftenUsedParamsService.setWarehouse(data.data)
            })
        )
    }
    public getBankCount(): Observable<void> {
        return this.getCount(this._urls.bankMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getBanks(data.data.count)
            })
        )
    }
    private _getBanks(count: number): Observable<void> {
        return this.getByUrl(this._urls.bankMainUrl, count, 0).pipe(
            map((data: ServerResponse<BankPayload[]>) => {
                this._oftenUsedParamsService.setBank(data.data)

            })
        )
    }
    public getCurrenciesCount(): Observable<void> {
        return this.getCount(this._urls.currenciesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getCurrencies(data.data.count)
            })
        )
    }
    private _getCurrencies(limit: number): Observable<void> {
        return this.getByUrl(this._urls.currenciesMainUrl, limit, 0).pipe(
            map((data: ServerResponse<Currency[]>) => {
                this._oftenUsedParamsService.setCurrency(data.data)
            })
        )
    }
    public getServiceCount(): Observable<void> {
        return this.getCount(this._urls.serviceMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getServices(data.data.count)
            })
        )
    }
    private _getServices(count: number): Observable<void> {
        return this.getByUrl(this._urls.serviceMainUrl, count, 0).pipe(
            map((data: ServerResponse<Services[]>) => {
                this._oftenUsedParamsService.setServices(data.data)
            })
        )
    }
    public getAnalyticGroupCount(group: { url: string, name: string }): Observable<void> {
        return this.getCount(group.url).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                let count = data.data.count;
                return this._getAnalyticGroup(count, group);
            })
        )
    }
    private _getAnalyticGroup(count: number, group: { url: string, name: string }): Observable<void> {
        return this.getByUrl(group.url, count, 0).pipe(
            map((data: ServerResponse<AnalyticalGroup[]>) => {
                if (group.name == '1') {
                    this._oftenUsedParamsService.setAnalyticalGroup1(data.data);
                } else {
                    this._oftenUsedParamsService.setAnalyticalGroup2(data.data)
                }
            })
        )
    }
    public getEmployeesCount(): Observable<void> {
        return this.getCount(this._urls.employeeMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getEmployees(data.data.count)
            })
        )
    }
    private _getEmployees(count: number): Observable<void> {
        return this.getByUrl(this._urls.employeeMainUrl, count, 0).pipe(
            map((data: ServerResponse<Employees[]>) => {
                this._oftenUsedParamsService.setEmployees(data.data)
            })
        )
    }

    public getStampFee(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.stampFeeUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setStampFee(data.data)
            })
        )
    }

    public getCalculationTypes(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.aahTypeUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setCalculationTypes(data.data)
            })
        )
    }
    public getBenefits(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.benefitsUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setBenefit(data.data)
            })
        )
    }

    public getProvisions(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.provisionsUrl).pipe(
            map((data: ServerResponse<Provisions>) => {
                this._oftenUsedParamsService.setProvisions(data.data)
            })
        )
    }

    public getAahReflectionForm(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.aahFormOfReflectionUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setAahReflectionForm(data.data)
            })
        )
    }
    public getTypeOfAcquisition(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.serviceAcquisitionTypeUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setTypeOfAcquisition(data.data)
            })
        )
    }
    public getSalaryType(): Observable<void> {
        return this.getByUrlWithoutLimit(this._urls.salaryTypeUrl).pipe(
            map((data: ServerResponse<JsonObjectType[]>) => {
                this._oftenUsedParamsService.setSalaryType(data.data);
            })
        )
    }
    public setOperationArray(array, fb: FormBuilder) {
        let operationArray = []
        array.forEach((element) => {
            operationArray.push(fb.group({
                debit: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.debitId, 'id'), 0),
                debitProcess: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getPartners(), element.dPartnersId, 'id'), 0),
                debitGroup1: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup1(), element.dAnaliticGroup_1Id, 'id'), 0),
                debitGroup2: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup2(), element.dAnaliticGroup_2Id, 'id'), 0),
                credit: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.creditId, 'id'), 0),
                creditProcess: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getPartners(), element.cPartnersId, 'id'), 0),
                creditGroup1: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup1(), element.cAnaliticGroup_1Id, 'id'), 0),
                creditGroup2: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup2(), element.cAnaliticGroup_2Id, 'id'), 0),
                amountInDram: element.money,
                comment: element.comment,
                id: null
            }))
        })
        return operationArray
    }
    public getOperationArray(url: string, body, form: FormGroup, fb: FormBuilder, tabs?: TabItem[]): void {
        this.addByUrl(url, body).subscribe((data: ServerResponse<OperationModel[]>) => {
            let operationArray = []
            data.data.forEach((element) => {
                operationArray.push(fb.group({
                    debit: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.debitId, 'id'), 0),
                    debitProcess: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getPartners(), element.dPartnersId, 'id'), 0),
                    debitGroup1: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup1(), element.dAnaliticGroup_1Id, 'id'), 0),
                    debitGroup2: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup2(), element.dAnaliticGroup_2Id, 'id'), 0),
                    credit: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.creditId, 'id'), 0),
                    creditProcess: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getPartners(), element.cPartnersId, 'id'), 0),
                    creditGroup1: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup1(), element.cAnaliticGroup_1Id, 'id'), 0),
                    creditGroup2: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getAnalyticalGroup2(), element.cAnaliticGroup_2Id, 'id'), 0),
                    amountInDram: element.money,
                    comment: element.comment,
                    id: null
                }))
            })
            form.get('operation').setValue(operationArray);
            this._componentDateService.offIsGetOperation()
            // if (tabs) {
            //     tabs.forEach((tab) => {
            //         if (tab.key == 'operation') {
            //             tab.isValid = form.get('operation').valid
            //         }
            //     })
            // }
        },
            (err) => {
                this.translateServerError(err)

            })
    }
    public translateServerError(err) {
        if (err && err.error) {
            let error = (err.error.data && err.error.data.length) ? err.error.data[0].param : (err.error.error && err.error.error.param) ? err.error.error.param : err.error.error;
            let message = (err.error.data && err.error.data.length) ? err.error.data[0].message : (err.error.error && err.error.error.message) ? err.error.error.message : err.error.message;
            let errorKey = (error && error.length) ? error.split('.') : error;
            let translateKey: string;
            this.getErrorTranslateJson().subscribe((data) => {
                translateKey = (errorKey && errorKey.length) ? data[errorKey[errorKey.length - 1]] : data[errorKey];
                let messageKey = (errorKey && errorKey.length) ? message.replace(`"${errorKey[errorKey.length - 1]}"`, '') : '';
                let messageTranslate = messageKey && data[messageKey] ? data[messageKey] : '';
                let errorText = translateKey ? translateKey + messageTranslate : message;
                this._messageService.add({ severity: 'error', summary: '', detail: errorText });
            })
        }
    }
    public getAvarageSalaryArray(url: string, body, form: FormGroup, fb: FormBuilder, tabs?: TabItem[]): void {
        this.addByUrl(url, body).subscribe((data: ServerResponse<any[]>) => {
            let avarageSalaryArray = []
            data.data.forEach((element) => {
                avarageSalaryArray.push(fb.group({
                    date: new Date(element.date),
                    amount: element.money,
                    isConsider: element.isConsider,
                    comment: element.comment
                }))
            })
            form.get('avarageSalary').setValue(avarageSalaryArray);
            if (tabs) {
                tabs.forEach((tab) => {
                    if (tab.key == 'avarageSalary') {
                        tab.isValid = form.get('avarageSalary').valid
                    }
                })
            }

        })
    }
    public getInformationByType(url: string): Observable<ServerResponse<any>> {
        let params = new HttpParams();
        params = params.set(this._isAutorized, 'true');
        return this._httpClient.get<ServerResponse<any>>(`${url}`, { params })
    }
    public generateField(tableName: string, columnName: string) {
        return this.getByUrlWithoutLimit(`generet-code/${tableName}/${columnName}`)
    }
    public getErrorTranslateJson() {
        return this._http.get("assets/server-error.json").pipe(
            map((res: any) => res.json())
        )
    }
    public getMaterialValueByWarehouse(id: number, typeId: number, date: string) {
        return this.getByUrlWithoutLimit(`warehouse-exit-material-value/${id}/${typeId}/${date}`)
    }
    private _setAvaibilityByUpdate(element, exitSpecifications) {
        if (exitSpecifications && exitSpecifications.length)
            exitSpecifications.forEach((exitSpecification) => {
                if (element && element.allDate) {
                    element.allDate.forEach((item) => {
                        item['availability'] = 0
                        if (exitSpecification.materialValueId == item.materialValueId
                            && exitSpecification.warehouseSignificanceId == item.warehouseSignificanceId
                            && exitSpecification.warehouseId == item.warehouseId
                        ) {
                            item['availability'] = +exitSpecification.availability;

                        }
                    })
                } else {

                    element['availability'] = 0
                    if (exitSpecification.materialValueId == element.materialValueId
                        && exitSpecification.warehouseSignificanceId == element.warehouseSignificanceId
                        && exitSpecification.warehouseId == element.warehouseId
                    ) {
                        element['availability'] = +exitSpecification.availability;
                    }
                }
            })
        let sum = 0

        if (element && element.allDate) {
            element.allDate.forEach((item) => {
                sum += (item['availability']) ? item['availability'] : (item.count - (item.sumQuantity[0] ? item.sumQuantity[0].sumQuantity : 0))
            })
        } else {
            sum = (element['availability']) ? element['availability'] : (element.count - (element.sumQuantity[0] ? element.sumQuantity[0].sumQuantity : 0))
        }

        element['availability'] = sum;
    }

    public calculateBatchValueByFifo(form: FormGroup, fb: FormBuilder) {
        let groupText = ''
        let batchArray = [];
        let allBatches = [];
        (form.get('groupCount').value as FormArray) = fb.array([]);
        (form.get('allGroupArrays').value as FormArray) = fb.array([]);
        let amount = 0
        let count = form.get('quantity').value;
        if (form.get('quantity').valid) {
            let currenctCount = count;
            let isFifo = false;

            if (form.get('code').value && form.get('code').value.allDate) {
                for (let data of form.get('code').value.allDate) {

                    if (!data.availability)
                        data['availability'] = (data.count - (data.sumQuantity[0] ? data.sumQuantity[0].sumQuantity : 0))
                    if (!data.calculateCount)
                        data['calculateCount'] = new FormControl(0, [Validators.max(data.availability), Validators.min(0)]);
                    if (!isFifo) {
                        if (currenctCount > data.availability) {
                            data.calculateCount.setValue(data.availability)
                            allBatches.push(fb.group(data))
                            if (data.calculateCount) {
                                batchArray.push(fb.group(data))
                            }

                        } else {
                            data.calculateCount.setValue(currenctCount);
                            allBatches.push(fb.group(data))

                            if (data.calculateCount) {
                                batchArray.push(fb.group(data))
                            }
                            isFifo = true
                        }

                        currenctCount = currenctCount - data.availability
                    } else {
                        data.calculateCount.setValue(0)
                        allBatches.push(fb.group(data))
                    }
                    amount += data.calculateCount.value * data.price
                }
            }
            groupText = 'Ավտոընտրություն'
        }

        (form.get('groupCount').value as FormArray) = fb.array(batchArray);
        (form.get('allGroupArrays').value as FormArray) = fb.array(allBatches)
        form.patchValue({
            groupText: groupText,

        })
        if (form.get('groupAmount')) {
            form.patchValue({
                groupAmount: amount
            })
        } else {
            form.patchValue({
                amount: amount
            })
        }

    }
    public setDataByMaterialValues(id: number, typeId: number, item: FormGroup, date, exitSpecification, isReset?: boolean) {
        this.getMaterialValueByWarehouse(id, typeId, date).subscribe((data: ServerResponse<MaterialValues[]>) => {
            let array = []
            let codeValue = item.get('code').value
            data.data.forEach((element: any) => {
                if (id && typeId) {
                    array = data.data
                    this._setAvaibilityByUpdate(element, exitSpecification);
                    if (codeValue) {
                        if (element && element.allDate)
                            element['point'] = element.allDate[0].point
                        if (codeValue.name == element.name && codeValue.availability == element.availability) {
                            element['point'] = item.get('code').value.point
                            item.get('code').setValue(element)
                            if (item.get('expenseAccount'))
                                item.patchValue({
                                    expenseAccount: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.salesExpenseAccountId, 'id'), 0),
                                    incomeAccount: this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getChartAccounts(), element.salesRevenueAccountId, 'id'), 0),
                                })
                        }
                    }
                } else {
                    array = []
                    data.data.forEach((element: any) => {
                        this._groupAllDate(element)
                        element.allDate.forEach(allDate => {
                            allDate['id'] = element.id
                            allDate['name'] = element.name
                            array.push(allDate);
                            this._setAvaibilityByUpdate(allDate, exitSpecification)
                        });

                    });
                }
            });

            item.patchValue({
                materialValuesArray: array,
                // code: null,
                // availability:0
            })
            if (!isReset) {
                item.patchValue({
                    code: null,
                    availability: 0
                })
            } else {
                this._setAvailability(item)

            }
            this._loadingService.hideLoading()
        })
    }
    private _setAvailability(form: FormGroup) {
        let sum = 0;

        if (form.get('code').value && form.get('code').value.allDate)
            for (let item of form.get('code').value.allDate) {
                sum += item['availability'] ? item['availability'] : item.count - (item.sumQuantity[0] ? item.sumQuantity[0].sumQuantity : 0)
            }

        form.get('availability').setValue(sum);
        form.get('quantity').setValidators([Validators.max(sum), Validators.min(0)]);
        form.get('quantity').setValue((form.get('quantity').value > sum) ? 0 : form.get('quantity').value)

    }
    private _groupAllDate(val) {
        let final: any = []
        for (let i = 0; i < val.allDate.length; i++) {
            const element = val.allDate[i];
            let b = false;
            for (let index = 0; index < final.length; index++) {
                const item = final[index];
                if (item.warehouseId == element.warehouseId && item.warehouseSignificanceId == element.warehouseSignificanceId) {
                    b = true
                    item.count += element.count;
                }
            }
            if (!b) {
                if (element.count > 0)
                    final.push(element)
            }
        }

        val.allDate = final;
    }
    public getMaterialValuesByWarehouseId(id: number, typeId: number, date, exitSpecification, ) {
        let array = []
        this.getMaterialValueByWarehouse(id, typeId, date).subscribe((data: ServerResponse<MaterialValues[]>) => {
            data.data.forEach((val: any) => {
                this._groupAllDate(val)
                val.allDate.forEach(allDate => {
                    allDate['id'] = val.id
                    allDate['name'] = val.name
                    array.push(allDate)
                    this._setAvaibilityByUpdate(allDate, exitSpecification)
                });

            });
            this._loadingService.hideLoading()
        })
        return array
    }
    public getBankName(form: FormGroup, accountControlName: string) {
        let settlementAccount = form.get(accountControlName).value;
        let bankName = '';
        if (settlementAccount) {
            if (settlementAccount.trim().length > 4) {
                let firsFiveNumbers = settlementAccount.trim().slice(0, 5)
                let bank = this._appService.checkProperty(this._appService.filterArray(this._oftenUsedParamsService.getBank(), firsFiveNumbers, 'code'), 0)
                bankName = bank ? bank.name : ''
            }
        }
        return bankName
    }
}
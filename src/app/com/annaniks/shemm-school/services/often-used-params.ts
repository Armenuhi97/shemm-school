import { Injectable } from '@angular/core';
import { AnalyticalGroup, WareHouse, AccountPlans, Partner, MaterialValues, Services, JsonObjectType, Provisions, Employees, BankPayload, Currency } from '../models/global.models';

@Injectable()
export class OftenUsedParamsService {
    private _analyticalGroup1: AnalyticalGroup[] = [];
    private _analyticalGroup2: AnalyticalGroup[] = []
    private _partners: Partner[] = [];
    private _chartAccounts: AccountPlans[] = []
    private _warehouses: WareHouse[] = [];
    private _unitOfMeasurements: MaterialValues[] = [];
    private _services: Services[] = []
    private _currencies: Currency[] = [];
    private _banks: BankPayload[] = []
    private _currentSelectedType: string;
    private _aahReflectionForm: JsonObjectType[] = []
    private _calculationTypes: JsonObjectType[] = []
    private _typeOfAcquisition: JsonObjectType[] = []
    private _calculateSalaryArray: JsonObjectType[] = []
    private _stampFee: JsonObjectType[] = []
    private _benefits: JsonObjectType[] = []
    private provosions: Provisions;
    private _startDate: string;
    private _endDate: string;
    private _additionStartDate;
    private _additionEndDate;
    private _holdStartDate;
    private _holdEndDate;
    private _employees: Employees[] = []
    public monthNames = [{ id: 1, name: 'Հունվար' }, { id: 2, name: 'Փետրվար' }, { id: 3, name: 'Մարտ' },
    { id: 4, name: 'Ապրիլ' }, { id: 5, name: 'Մայիս' }, { id: 6, name: 'Հունիս' }, { id: 7, name: 'Հուլիս' },
    { id: 8, name: 'Օգոստոս' }, { id: 9, name: 'Սեպտեմբեր' }, { id: 10, name: 'Հոկտեմբեր' },
    { id: 11, name: 'Նոյեմբեր' }, { id: 12, name: 'Դեկտեմբեր' }]
    private _previousValue;
    private _previousValue2;

    public setPreviousValue($event) {
        this._previousValue = $event
    }
    public getPreviousValue() {
        return this._previousValue
    }

    public setPreviousValue2($event) {
        this._previousValue2 = $event
    }
    public getPreviousValue2() {
        return this._previousValue2
    }

    public getStartDate() {
        return this._startDate
    }
    public setStartDate(param) {
        this._startDate = param
    }
    public getEndDate() {
        return this._endDate
    }
    public setEndDate(param) {
        this._endDate = param
    }
    public getStartAdditionDate() {
        return this._additionStartDate
    }
    public setStartAdditionDate(param) {
        this._additionStartDate = param
    }
    public getAdditionEndDate() {
        return this._additionEndDate
    }
    public setAdditionEndDate(param) {
        this._additionEndDate = param
    }
    public getStartHoldDate() {
        return this._holdStartDate
    }
    public setStartHoldDate(param) {
        this._holdStartDate = param
    }
    public getHoldEndDate() {
        return this._holdEndDate
    }
    public setHoldEndDate(param) {
        this._holdEndDate = param
    }

    public setStampFee(param: JsonObjectType[]): void {
        this._stampFee = param
    }
    public getStampFee(): JsonObjectType[] {
        return this._stampFee
    }

    public setSalaryType(param: JsonObjectType[]): void {
        this._calculateSalaryArray = param
    }
    public getSalaryType(): JsonObjectType[] {
        return this._calculateSalaryArray
    }
    public setCalculationTypes(param: JsonObjectType[]): void {
        this._calculationTypes = param
    }
    public setTypeOfAcquisition(param: JsonObjectType[]): void {
        this._typeOfAcquisition = param
    }
    public getCalculationTypes(): JsonObjectType[] {
        return this._calculationTypes
    }
    public getTypeOfAcquisition(): JsonObjectType[] {
        return this._typeOfAcquisition
    }

    public setAahReflectionForm(param: JsonObjectType[]): void {
        this._aahReflectionForm = param
    }
    public getAahReflectionForm(): JsonObjectType[] {
        return this._aahReflectionForm
    }
    public setBenefit(param: JsonObjectType[]): void {
        this._benefits = param
    }
    public getBenefit(): JsonObjectType[] {
        return this._benefits
    }


    public setProvisions(param: Provisions): void {
        this.provosions = param
    }
    public getProvisions(): Provisions {
        return this.provosions
    }
    public setBank(param: BankPayload[]) {
        this._banks = param
    }
    public getBank(): BankPayload[] {
        return this._banks
    }
    public setCurrency(param: Currency[]) {
        this._currencies = param
    }
    public getCurrency(): Currency[] {
        return this._currencies
    }

    public setWarehouse(param: WareHouse[]) {
        this._warehouses = param
    }
    public getWarehouse(): WareHouse[] {
        return this._warehouses
    }

    public setAnalyticalGroup1(param: AnalyticalGroup[]) {
        this._analyticalGroup1 = param
    }
    public getAnalyticalGroup1(): AnalyticalGroup[] {
        return this._analyticalGroup1
    }
    public setEmployees(param: Employees[]) {
        this._employees = param
    }
    public getEmployees(): Employees[] {
        return this._employees
    }

    public setAnalyticalGroup2(param: AnalyticalGroup[]) {
        this._analyticalGroup2 = param
    }
    public getAnalyticalGroup2(): AnalyticalGroup[] {
        return this._analyticalGroup2
    }

    public setPartners(param: Partner[]) {
        this._partners = param
    }
    public getPartners(): Partner[] {
        return this._partners
    }

    public setChartAccounts(param: AccountPlans[]) {
        this._chartAccounts = param
    }
    public getChartAccounts(): AccountPlans[] {
        return this._chartAccounts
    }

    public setMaterialValues(param: MaterialValues[]) {
        this._unitOfMeasurements = param
    }
    public getMaterialValues(): MaterialValues[] {
        return this._unitOfMeasurements
    }

    public getCurrentSelectedType(): string {
        return this._currentSelectedType
    }
    public setSelectedType(param: string): string {
        return this._currentSelectedType = param
    }
    public setServices(param: Services[]): void {
        this._services = param
    }
    public getServices(): Services[] {
        return this._services
    }
}
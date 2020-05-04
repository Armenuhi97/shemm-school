import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { forkJoin, Subscription, Observable } from 'rxjs';
import { LoadingService, ComponentDataService, AppService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { ModalDataModel, ServerResponse, ShortModel, Table, Addition, DeletedFormArrayModel, DataCount, Partners, Additions, AccountPlans, PositionModel, Employee, TabItem, JsonObjectType, GenerateType, FilteredAddition } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { map, switchMap } from 'rxjs/operators';
import { EmployeesService } from '../../pages/employees/employees.service';
import { AddUnitModal } from '../add-unit/add-unit.modal';
import { AddPositionModal } from '../../../salary/modals';
import { DatePipe } from '@angular/common';
import { DaysTabelModal } from 'src/app/com/annaniks/shemm-school/modals';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'employees-modal',
    templateUrl: 'employees.modal.html',
    styleUrls: ['employees.modal.scss']
})
export class EmployeesModal {
    private _error: string
    public formGroup: FormGroup;
    public defaultImage: string = '';
    private _image;
    public otherWithheldPaymentsTypes: Array<{ name: string }> = [{ name: 'Տոկոսով' }, { name: 'Գումարով' }]
    public holds = []
    public activeTab: string;
    public title: string;
    public accountPlans: AccountPlans[] = [];
    public types: Array<{ name: string }> = [{ name: 'Պահել հաշվ․' }, { name: 'Պահել առձեռն' }]
    public regions: ShortModel[] = [{ name: 'Shirak', id: 1 }]
    public communities: ShortModel[] = [{ name: 'Համայնք', id: 1 }]
    public countries: Array<{ name: string }> = [{ name: 'Հայաստան' }];
    public postNumbers: ShortModel[] = [{ name: '1', id: 1 }]
    public genders: ShortModel[] = [{ id: 1, name: 'Արական' }, { id: 2, name: 'Իգական' }]
    private _tabsItem: TabItem[] = [{ title: 'Ընդհանուր', isValid: true, key: 'common' },
    { title: 'Հասցեներ', isValid: true, key: 'address' }, { title: 'Հավելումներ', isValid: true, key: 'addition' },
    // { title: 'Պահումներ', isValid: true, key: 'hold' },
    { title: 'Այլ պահվող վճարումներ', isValid: true, key: 'payments' },
    { title: 'Այլ տվյալներ', isValid: true, key: 'otherData' }];
    public identityDocumentTypes: ShortModel[] = [{ name: 'test', id: 1 }];
    public educations: ShortModel[] = [{ name: 'education 1', id: 1 }];
    private _selectedEmployeePosition = [];
    private _selectedEmployeeAccounts = [];
    private _selectedEmployeeAddition = []
    private _subscription: Subscription;
    private _subscription1: Subscription;
    public subdivision: ShortModel[] = [];
    public positions: PositionModel[] = [];
    public tables: Table[] = [];
    public additions: Addition[] = [];
    public professions: ShortModel[] = [];
    public contracts = [];
    public partners: Partners[] = []
    private _deletedAddition: DeletedFormArrayModel[] = [];
    private _deletedHold: DeletedFormArrayModel[] = [];

    public stampFee: JsonObjectType[] = []
    constructor(private _fb: FormBuilder,
        private _employeesService: EmployeesService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<EmployeesModal>,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _matDialog: MatDialog,
        private _datePipe: DatePipe,
        private _messageService: MessageService,
        @Inject('URL_NAMES') private _urls
    ) { this.title = this._data.title }

    ngOnInit() {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.type == 'addition') {

                    if (data.isDeletedArray && data.isDeletedArray.length)
                        data.isDeletedArray.forEach(element => {
                            this._deletedAddition.push(element)
                        });

                    let addition = data.data.value;
                    if (data.data.controls) {
                        if (data.data.controls.byMonthArray && data.data.controls.byMonthArray.controls)
                            addition['byMonthArray'] = data.data.controls.byMonthArray.controls;
                        if (data.data.controls.investmentExpenditureArray && data.data.controls.investmentExpenditureArray.controls)
                            addition['investmentExpenditureArray'] = data.data.controls.investmentExpenditureArray.controls;
                        this.formGroup.get(data.type).setValue(addition)

                    }

                } else {
                    this.formGroup.get(data.type).setValue(data.data);
                }

                for (let i = 0; i < this._tabsItem.length; i++) {
                    if (this._tabsItem[i].key == data.type) {
                        this._tabsItem[i].isValid = data.isValid
                    }
                }
            }
        })
        this._validate();
    }
    public generateTableCounter() {
        this._employeesService.generateTableCounter().subscribe((data: ServerResponse<GenerateType>) => {
            this.formGroup.get('reportCard').setValue(data.data.message.maxColumValue)
        })
    }
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getSubdivisionCount(),
            this._getPositionsCount(),
            this._getAdditionsCount(),
            this._getContractsCount(),
            this._getPartnersCount(),
            this._getProfessionsCount(),
            this._getAccountPlansCount(),
            // this._getHoldsCount(),
            this._mainService.getStampFee()
        )
        this._subscription = combine.subscribe(() => {
            this.stampFee = this._oftenUsedParamsService.getStampFee()
            this._getEmployeeById()
        })
    }
  
    private _setAdditions(key: string) {
        let employeeAddition = [];

        let startDateFormat = this._datePipe.transform(this.setLastMonthDate(), 'yyyy-MM-dd');
        let endDateFormat = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
        this._employeesService.filterAddition(this._data.id, key, startDateFormat, endDateFormat).subscribe((data: ServerResponse<FilteredAddition[]>) => {
            data.data.forEach((element) => {
                if (key == 'addition') {
                    this._oftenUsedParamsService.setStartAdditionDate(this._datePipe.transform(this.setLastMonthDate(), 'yyyy-MM-dd'))
                    this._oftenUsedParamsService.setAdditionEndDate(this._datePipe.transform(new Date(), 'yyyy-MM-dd'))
                } 
                // else {
                //     this._oftenUsedParamsService.setStartHoldDate(this._datePipe.transform(this.setLastMonthDate(), 'yyyy-MM-dd'))
                //     this._oftenUsedParamsService.setHoldEndDate(this._datePipe.transform(new Date(), 'yyyy-MM-dd'))
                // }


                employeeAddition.push(this._fb.group({
                    additionId: this._fb.control(this._appService.checkProperty(this._appService.filterArray(this.additions, element.additionId, 'id'), 0), Validators.required),
                    name: this._fb.control(this._appService.checkProperty(this._appService.checkProperty(this._appService.filterArray(this.additions, element.additionId, 'id'), 0), 'name'), Validators.required),
                    money: this._fb.control(element.money, Validators.required),
                    isMain: this._fb.control(this._appService.getBooleanVariable(element.isMain)),
                    date: this._fb.control(new Date(element.date), Validators.required),
                    id: this._fb.control(element.id)
                }))
            })

        })
        return employeeAddition
    }
    private _getEmployeeById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((value: ServerResponse<Employee>) => {
                if (value) {
                    let employee = value.data;
                    let street1 = (employee.addressies && employee.addressies.street) ? employee.addressies.street.split(',') : null;
                    let street2 = (employee.addressies && employee.addressies.hhStreet) ? employee.addressies.hhStreet.split(',') : null
                    let positions = [];
                    if (employee && employee.employeePosition) {
                        employee.employeePosition.forEach((data) => {
                            let workingScheduleArray = []
                            if (data && data.workingSchedule) {
                                data.workingSchedule.forEach((element) => {
                                    workingScheduleArray.push(element)
                                })
                            }

                            let obj = {
                                position: this._appService.checkProperty(this._appService.filterArray(this.positions, data.positionId, 'id'), 0),
                                startDate: this._checkDateProperty(data.startOfPosition),
                                endDate: this._checkDateProperty(data.endOfPosition),
                                type: this._appService.checkProperty(this._appService.filterArray(this.additions, data.additionId, 'id'), 0),
                                rate: data.rateSallary,
                                hoursInWeekDays: this._fb.array(workingScheduleArray),
                                id: data.id
                            }
                            positions.push(this._fb.group(obj));
                            this._selectedEmployeePosition.push({
                                position: data.positionId,
                                startDate: this._datePipe.transform(this._checkDateProperty(data.startOfPosition), 'yyyy-MM-dd'),
                                endDate: this._datePipe.transform(this._checkDateProperty(data.endOfPosition), 'yyyy-MM-dd'),
                                type: this._appService.checkProperty(this._appService.filterArray(this.additions, data.additionId, 'id'), 0),
                                rate: data.rateSallary,
                                hoursInWeekDays: this._appService.checkProperty(data, 'workingSchedule') ? this._fb.array(this._appService.checkProperty(data, 'workingSchedule')) : null,
                                id: data.id
                            })
                        })
                    }

                    let accounts = [];
                    if (employee && employee.employeeAccounts) {
                        employee.employeeAccounts.forEach((data) => {
                            let obj = {
                                otherWithheldPayments: data.percent,
                                planningCurrentAccounts: this._appService.checkProperty(this._appService.filterArray(this.accountPlans, data.accountOfEmployeeCalculationId, 'id'), 0),
                                savingType: this._appService.checkProperty(this._appService.filterArray(this.types, data.type, 'name'), 0),
                                id: data.id,
                                name: data.name,
                                type: this._appService.checkProperty(this._appService.filterArray(this.otherWithheldPaymentsTypes, data.isPercent, 'name'), 0)
                            }
                            this._selectedEmployeeAccounts.push({
                                otherWithheldPayments: data.percent,
                                planningCurrentAccounts: data.accountOfEmployeeCalculationId,
                                savingType: this._appService.checkProperty(this._appService.filterArray(this.types, data.type, 'name'), 0),
                                id: data.id,
                                name: data.name,
                                type: this._appService.checkProperty(this._appService.filterArray(this.otherWithheldPaymentsTypes, data.isPercent, 'name'), 0)
                            })
                            accounts.push(this._fb.group(obj))
                        })
                    }

                    let employeeAddition = this._setAdditions('addition');
                    let employeeHold = this._setAdditions('hold')
                    this.formGroup.patchValue({
                        reportCard: employee.tabelCounter,
                        fullName: employee.fullName,
                        name: employee.firstName,
                        surname: employee.lastName,
                        // patronymic: '',
                        unit: this._appService.checkProperty(this._appService.filterArray(this.subdivision, employee.subdivisionId, 'id'), 0),
                        common: {
                            profession: this._appService.checkProperty(this._appService.filterArray(this.professions, this._appService.checkProperty(employee.general, 'professionId'), 'id'), 0),
                            gender: this._appService.checkProperty(this._appService.filterArray(this.genders, this._appService.checkProperty(employee.general, 'gender'), 'name'), 0),
                            birthday: this._checkDateProperty(this._appService.checkProperty(employee.general, 'birthdate')),
                            contractType: this._appService.checkProperty(this._appService.filterArray(this.contracts, this._appService.checkProperty(employee.general, 'contractId'), 'id'), 0),
                            adoptionDate: this._checkDateProperty(this._appService.checkProperty(employee.general, 'dateOfAccept')),
                            orderAdmissionWork: this._appService.checkProperty(employee.general, 'acceptedCommand'),
                            releaseDate: this._checkDateProperty(this._appService.checkProperty(employee.general, 'releaseDate')),
                            dismissalOrder: this._appService.checkProperty(employee.general, 'releaseCommand'),
                            // isCumulativeParticipant: ,
                            stampFee: this._appService.checkProperty(this._appService.filterArray(this.stampFee, +this._appService.checkProperty(employee.general, 'stampFee'), 'id'), 0),
                            // this._appService.checkProperty(employee.general, 'stampFee'),
                            paymentAccount: this._appService.checkProperty(this._appService.filterArray(this.accountPlans, this._appService.checkProperty(employee.general, 'accountId'), 'id'), 0),

                        },

                        payments: accounts,

                        address: {
                            registration: {
                                place: this._appService.getBooleanVariable(this._appService.checkProperty(employee.addressies, 'placeOfRegistration')),
                                region: this._appService.checkProperty(this._appService.filterArray(this.regions, this._appService.checkProperty(employee.addressies, 'state'), 'name'), 0),
                                community: this._appService.checkProperty(this._appService.filterArray(this.communities, this._appService.checkProperty(employee.addressies, 'community'), 'name'), 0),
                                city: this._appService.checkProperty(employee.addressies, 'city'),
                                street: street1 ? street1[0] : null,
                                home: street1 ? street1[1] : null,
                                apartment: street1 ? street1[2] : null,
                            },

                            isResidence: this._appService.getBooleanVariable(this._appService.checkProperty(employee.addressies, 'sameResidence')),
                            residence: {
                                region: this._appService.checkProperty(this._appService.filterArray(this.regions, this._appService.checkProperty(employee.addressies, 'hhState'), 'name'), 0),
                                place: this._appService.getBooleanVariable(this._appService.checkProperty(employee.addressies, 'hhResidence')),
                                community: this._appService.checkProperty(this._appService.filterArray(this.communities, this._appService.checkProperty(employee.addressies, 'hhCommunity'), 'name'), 0),
                                city: this._appService.checkProperty(employee.addressies, 'hhCity'),
                                street: street2 ? street2[0] : null,
                                home: street2 ? street2[1] : null,
                                apartment: street2 ? street2[2] : null,
                                country: this._appService.checkProperty(this._appService.filterArray(this.countries, this._appService.checkProperty(employee.addressies, 'country'), 'name'), 0),

                                address1: this._appService.checkProperty(employee.addressies, 'addressee1'),
                                address2: this._appService.checkProperty(employee.addressies, 'addressee2'),
                                address3: this._appService.checkProperty(employee.addressies, 'addressee3'),
                                post: this._appService.checkProperty(employee.addressies, 'post')
                            }

                            // residencePost: this._appService.checkProperty(this._appService.filterArray(this.postNumbers, this._appService.checkProperty(employee.addressies, 'post'), 'name'), 0)
                        },
                        otherData: {
                            bankAccount: this._appService.checkProperty(employee.otherInformation, 'bankNumber'),
                            socialCard: this._appService.checkProperty(employee.otherInformation, 'socialCardNumber'),
                            identityDocumentType: this._appService.checkProperty(this._appService.filterArray(this.identityDocumentTypes, this._appService.checkProperty(employee.otherInformation, 'documentTypeId'), 'id'), 0),
                            identityDocumentNumber: this._appService.checkProperty(employee.otherInformation, 'passportNumber'),
                            issueDate: this._checkDateProperty(this._appService.checkProperty(employee.otherInformation, 'dueDate')),
                            personIssue: this._appService.checkProperty(employee.otherInformation, 'byWhom'),
                            nationality: this._appService.checkProperty(employee.otherInformation, 'nationality'),
                            otherDocument: this._appService.checkProperty(employee.otherInformation, 'anotherDocumentNumber'),
                            phone: this._appService.checkProperty(employee.otherInformation, 'phone'),
                            mobilePhone: this._appService.checkProperty(employee.otherInformation, 'phone2'),
                            language: this._appService.checkProperty(employee.otherInformation, 'language'),
                            education: this._appService.checkProperty(employee.otherInformation, 'education')
                            // this._appService.checkProperty(this._appService.filterArray(this.educations, this._appService.checkProperty(employee.otherInformation, 'education'), 'name'), 0)
                        },
                        addition: {
                            startDate: this.setLastMonthDate(),
                            endDate: new Date(),
                            byMonthArray: employeeAddition,
                            investmentExpenditureArray: []
                        },
                        hold: {
                            startDate: this.setLastMonthDate(),
                            endDate: new Date(),
                            //////
                            byMonthArray: employeeHold,
                            investmentExpenditureArray: []
                        }
                    })

                    if (positions && positions.length) {
                        (this.formGroup.controls.position as FormArray) = this._fb.array([])
                        positions.forEach(element => {
                            (this.formGroup.get('position') as FormArray).push(element);
                            this._appService.markFormGroupTouched(element)
                        });
                    } else {
                        (this.formGroup.get('position') as FormArray).controls.forEach((el) => {
                            this._appService.markFormGroupTouched(this._fb.group(el))
                        })
                    }
                }
                this._loadingService.hideLoading()
            })
        } else {
            this.generateTableCounter()

            this._setDefaultValueOfAdditionAndHolds('addition');
            this._setDefaultValueOfAdditionAndHolds('hold')
            this._loadingService.hideLoading()
        }
    }
    private _setDefaultValueOfAdditionAndHolds(key: string) {
        this.formGroup.get(key).setValue({
            startDate: this.setLastMonthDate(),
            endDate: new Date(),
            byMonthArray: [],
            investmentExpenditureArray: []
        })
    }
    private _checkDateProperty(value) {
        return value ? new Date(value) : null
    }
    private setLastMonthDate() {
        let today = new Date();
        let lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        return lastMonth
    }
    private _setFilterCondition(current, select, key: string): boolean {

        if (key == 'account') {
            return (current.accountOfEmployeeCalculationId == select.planningCurrentAccounts &&
                current.isPercent == this._appService.checkProperty(select.type, 'name') &&
                current.type == this._appService.checkProperty(select.savingType, 'name') &&
                current.percent == select.otherWithheldPayments && current.id == select.id && current.name == select.name)
        } else {
            if (key == 'position') {
                return (current.positionId == select.position &&
                    current.startOfPosition == select.startDate && current.additionId == select.type.id && current.rateSallary == select.rate &&
                    current.endOfPosition == select.endDate && current.id == select.id
                )


            }
        }
    }
    private _setSecondFilterCondition(select, current, key: string): boolean {
        if (key == 'account') {
            return (select.otherWithheldPayments == current.percent &&
                select.planningCurrentAccounts == current.accountOfEmployeeCalculationId &&
                select.name == current.name &&
                this._appService.checkProperty(select.type, 'name') == current.isPercent &&
                this._appService.checkProperty(select.savingType, 'name') == current.type && select.id == current.id)
        } else {
            if (key == 'position') {
                return (select.position == current.positionId && select.type.id == current.additionId && select.rate == current.rateSallary
                    && select.startDate == current.startOfPosition &&
                    select.endDate == current.endOfPosition && select.id == current.id)
            }
        }
    }

    private _setObject(select, key: string): Object {
        let object = {}
        if (key == 'account') {
            object = {
                accountOfEmployeeCalculationId: select.planningCurrentAccounts,
                type: select.savingType.name,
                isPercent: this._appService.checkProperty(select.type, 'name'),
                percent: select.otherWithheldPayments,
                //
                name: select.name,
                id: select.id,
                status: 'deleted'
            }
        } else {
            if (key == 'position') {
                object = {
                    positionId: select.position,
                    startOfPosition: select.startDate,
                    endOfPosition: select.endDate,
                    id: select.id,
                    additionId: this._appService.checkProperty(select.type, 'id'),
                    rateSallary: select.rate,
                    status: 'deleted'
                }

                if (select && select.hoursInWeekDays && select.hoursInWeekDays.value) {
                    object['workingSchedule'] = select.hoursInWeekDays.value
                }

            }
        }
        return object
    }

    private _setStatus(selectArray, currentArray, key: string) {
        if (selectArray.length && currentArray.length) {
            for (let select of selectArray) {
                let element = currentArray.filter((current) => {
                    return this._setFilterCondition(current, select, key)
                })
                let index = (element && element.length) ? currentArray.indexOf(element[0]) : -1;
                if (index > -1) {
                    currentArray[index]['status'] = "unChanged"
                } else {
                    if (select)
                        currentArray.push(this._setObject(select, key))
                }
            }
            currentArray.forEach((current, index: number) => {
                let element = selectArray.filter((select) => {
                    return this._setSecondFilterCondition(select, current, key)
                })
                if ((element && !element.length) || !element) {
                    delete currentArray[index]['id']
                    currentArray[index]['status'] = "new"
                }
            })

        } else {
            if ((!currentArray || (currentArray && !currentArray.length)) && (selectArray && selectArray.length)) {
                selectArray.forEach((select) => {
                    currentArray.push(this._setObject(select, key))
                })
            } else {
                if ((currentArray && currentArray.length) && (!selectArray || (selectArray && !selectArray.length))) {
                    currentArray.forEach((current) => {
                        current['status'] = 'new'
                    })
                }
            }
        }

        return currentArray
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
                this.subdivision = data.data;
            })
        )
    }


    private _getPositionsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.positionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getPositions(data.data.count)
            })
        )
    }
    private _getPositions(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.positionMainUrl, count, 0).pipe(
            map((data: ServerResponse<PositionModel[]>) => {
                this.positions = data.data
            })
        )
    }


    private _getContractsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.contractMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getContracts(data.data.count)
            })
        )
    }
    private _getContracts(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.contractMainUrl, count, 0).pipe(
            map((data: ServerResponse<any[]>) => {
                this.contracts = data.data

            })
        )
    }
    private _getPartnersCount(): Observable<void> {
        return this._mainService.getCount(this._urls.partnerMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getPartners(data.data.count)
            })
        )
    }

    private _getPartners(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.partnerMainUrl, count, 0).pipe(
            map((data: ServerResponse<Partners[]>) => {
                this.partners = data.data;
            })
        )
    }
    private _getProfessionsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.professionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getProfessions(data.data.count)

            })
        )
    }
    private _getProfessions(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.professionMainUrl, count, 0).pipe(
            map((data: ServerResponse<ShortModel[]>) => {
                this.professions = data.data
            })
        )
    }
    private _getAccountPlansCount(): Observable<void> {
        return this._mainService.getCount(this._urls.accountPlanMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAccountPlans(data.data.count)
            })
        )
    }
    private _getAccountPlans(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.accountPlanMainUrl, count, 0).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.accountPlans = data.data
            })
        )
    }
    private _getAdditionsCount(): Observable<void> {
        return this._mainService.getCount(this._urls.additionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAdditions(data.data.count)
            })
        )
    }
    private _getAdditions(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.additionMainUrl, count, 0).pipe(
            map((data: ServerResponse<Addition[]>) => {
                this.additions = data.data;
            })
        )
    }
    public addUnit(): void {
        let dialog = this._matDialog.open(AddUnitModal,
            {
                width: '500px',
                data: { title: 'Ստորաբաժանում (Նոր)', url: this._urls.subdivisionGetOneUrl, array: this.subdivision }
            })
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this._getSubdivisionCount().subscribe()
            }
        })
    }
    public addNewPosition(): void {

        let dialog = this._matDialog.open(AddPositionModal,
            {
                width: '500px',
                height: '32vh',
                data: { title: 'Պաշտոն (Նոր)', url: this._urls.positionGetOneUrl, array: this.positions }
            })
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this._getPositionsCount().subscribe()
            }
        })

    }
    public close(): void {
        this._dialogRef.close();
        this._componentDataService.offClick()
    }
    public changeImage(event): void {
        if (event) {
            const reader = new FileReader();
            this._image = event;
            reader.onload = (e: any) => {
                this.defaultImage = 'url(' + e.target.result + ')';
            };
            if (event.target.files[0]) {
                reader.readAsDataURL(event.target.files[0]);
            }
        }
    }
    public getActiveTab($event: TabItem): void {
        this._componentDataService.onClick()
        this.activeTab = $event.title
    }
    private _validate(): void {
        this.formGroup = this._fb.group({
            reportCard: [null, Validators.required],
            // fullName: [null],
            name: [null, Validators.required],
            surname: [null, Validators.required],
            // patronymic: [null],
            unit: [null, Validators.required],
            position: this._fb.array([]),
            common: [null],
            address: [null],
            otherData: [null],
            addition: [null],
            hold: [null],
            payments: [null]
        })
        this._combineObservable()
    }
    public openWeekDaysTable(item: FormGroup, data): void {
        if (item.get('type').value && item.get('type').value.methodOfSallaryCalculation && +item.get('type').value.methodOfSallaryCalculation == 1) {
            let dialog = this._matDialog.open(DaysTabelModal, {
                width: '1300px',
                data: { value: data },
                autoFocus: false
            })
            dialog.afterClosed().subscribe((result) => {
                if (result) {
                    if (result.value) {
                        item.setControl('hoursInWeekDays', this._fb.array([]));
                        result.value.forEach((data) => {
                            (item.get('hoursInWeekDays') as FormArray).push(this._fb.group(data))
                        })
                    }
                }
            })
        }
    }


    public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public addPosition(): void {
        let formArray = this.formGroup.get('position') as FormArray;
        if (formArray && formArray.length !== 3)
            formArray.push(this._fb.group({
                id: [null],
                position: [null, Validators.required],
                type: [null, Validators.required],
                hoursInWeekDays: this._fb.array([]),
                rate: [null, Validators.required],
                startDate: [new Date()],
                endDate: [null]
            }))
    }
    public removePosition(index: number): void {
        let formArray = this.formGroup.get('position') as FormArray;
        formArray.removeAt(index)
    }

    public editDaysTable(item: FormGroup) {
        this.openWeekDaysTable(item, item.get('hoursInWeekDays').value)
    }
    public isEdit(item: FormGroup) {
        return (item.get('type').value && item.get('type').value.methodOfSallaryCalculation && +item.get('type').value.methodOfSallaryCalculation == 1) ? true : false
    }

    public save(): void {
        this._componentDataService.onClick()

        this._appService.markFormGroupTouched(this.formGroup);
        let employeePosition = []
        let count = 0;
        this.formGroup.get('position')['controls'].forEach((data) => {
            if (data.value.type) {
                if (+data.value.type.methodOfSallaryCalculation == 1) {
                    if (!data.value.hoursInWeekDays || (data.value.hoursInWeekDays && !data.value.hoursInWeekDays.length)) {
                        this.openWeekDaysTable(data, null);
                        count++
                        return
                    }
                }
            }
            let obj = {
                positionId: this._appService.checkProperty(data.value.position, 'id'),
                startOfPosition: this._datePipe.transform((data.value.startDate), 'yyyy-MM-dd'),
                endOfPosition: this._datePipe.transform((data.value.endDate), 'yyyy-MM-dd'),
                // id: (data.value && data.value.id) ? data.value.id : null,
                additionId: this._appService.checkProperty(data.value.type, 'id'),
                rateSallary: data.value.rate,
                workingSchedule: this._appService.checkProperty(data.value, 'hoursInWeekDays')
            }
            if (data.value && data.value.id) {
                obj['id'] = data.value.id
            }
            employeePosition.push(obj)

        })


        if (!count) {

            let additions = [];
            additions = this._setFinalySendAdditonHolds('addition', 'additionId')
            let holds = [];
            holds = this._setFinalySendAdditonHolds('hold', 'holdId')
            let employeeAccounts = [];
            if ((this.formGroup.get('payments').value)) {
                (this.formGroup.get('payments').value).forEach((data) => {
                    let obj = {
                        accountOfEmployeeCalculationId: this._appService.checkProperty(data.value.planningCurrentAccounts, 'id'),
                        type: this._appService.checkProperty(data.value.savingType, 'name'),
                        percent: data.value.otherWithheldPayments,
                        name: data.value.name,
                        isPercent: this._appService.checkProperty(data.value.type, 'name')
                    }
                    if (data.value && data.value.id) {
                        obj['id'] = data.value.id
                    }
                    employeeAccounts.push(obj)
                })
            }
            if (this._data.id) {
                employeeAccounts = this._setStatus(this._selectedEmployeeAccounts, employeeAccounts, 'account');
                employeePosition = this._setStatus(this._selectedEmployeePosition, employeePosition, 'position');;
            }
            if (this.formGroup.valid) {

                let sendObject = {
                    selfData: {
                        fullName: this.formGroup.get('name').value + ' ' + this.formGroup.get('surname').value,
                        firstName: this.formGroup.get('name').value,
                        lastName: this.formGroup.get('surname').value,
                        subdivisionId: this._appService.checkProperty(this.formGroup.get('unit').value, 'id'),
                        tabelCounter: this.formGroup.get('reportCard').value,
                    },
                    general: {
                        dateOfAccept: this._datePipe.transform(this._appService.checkProperty(this.formGroup.get('common').value, 'adoptionDate'), 'yyyy-MM-dd'),
                        releaseDate: this._datePipe.transform(this._appService.checkProperty(this.formGroup.get('common').value, 'releaseDate'), 'yyyy-MM-dd'),
                        acceptedCommand: this._appService.checkProperty(this.formGroup.get('common').value, 'orderAdmissionWork'),
                        releaseCommand: this._appService.checkProperty(this.formGroup.get('common').value, 'dismissalOrder'),
                        //additionId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'addition'), 'id'),
                        contractId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'contractType'), 'id'),
                        professionId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'profession'), 'id'),
                        gender: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'gender'), 'name'),
                        birthdate: this._datePipe.transform(this._appService.checkProperty(this.formGroup.get('common').value, 'birthday'), 'yyyy-MM-dd'),
                        accountId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'paymentAccount'), 'id'),
                        stampFee: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'stampFee'), 'id') !== null ? this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('common').value, 'stampFee'), 'id').toString() : null
                    },
                    addressies: {
                        state: this._appService.checkProperty(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'region'), 'name'),
                        community: this._appService.checkProperty(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'community'), 'name'),
                        city: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'city'),
                        street: this._joinElements(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'street'),
                            this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'home'),
                            this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'apartment')),
                        hhState: this._appService.checkProperty(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'region'), 'name'),
                        hhCommunity: this._appService.checkProperty(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'community'), 'name'),
                        hhCity: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'city'),
                        hhStreet: this._joinElements(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'street'),
                            this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'home'),
                            this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'apartment')),
                        country: this._appService.checkProperty(this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'country'), 'name'),
                        addressee1: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'address1'),
                        addressee2: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'address2'),
                        addressee3: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'address3'),
                        post: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'post'),

                        // post: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residencePost'), 'name'),
                        placeOfRegistration: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'registration'), 'place') ? true : false,
                        sameResidence: this._appService.checkProperty(this.formGroup.get('address').value, 'isResidence') ? true : false,
                        hhResidence: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('address').value, 'residence'), 'place') ? true : false,
                    },
                    otherInformation: {
                        bankNumber: this._appService.checkProperty(this.formGroup.get('otherData').value, 'bankAccount'),
                        socialCardNumber: this._appService.checkProperty(this.formGroup.get('otherData').value, 'socialCard'),
                        documentTypeId: this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('otherData').value, 'identityDocumentType'), 'id'),
                        passportNumber: this._appService.checkProperty(this.formGroup.get('otherData').value, 'identityDocumentNumber'),
                        dueDate: this._datePipe.transform(this._appService.checkProperty(this.formGroup.get('otherData').value, 'issueDate'), 'yyyy-MM-dd'),
                        byWhom: this._appService.checkProperty(this.formGroup.get('otherData').value, 'personIssue'),//?
                        nationality: this._appService.checkProperty(this.formGroup.get('otherData').value, 'nationality'),
                        anotherDocumentNumber: this._appService.checkProperty(this.formGroup.get('otherData').value, 'otherDocument'),
                        phone: this._appService.checkProperty(this.formGroup.get('otherData').value, 'phone') ?
                            this.formGroup.get('otherData').value.phone.startsWith('+374') ? this.formGroup.get('otherData').value.phone :
                                '+374' + this.formGroup.get('otherData').value.phone : null,
                        phone2: this._appService.checkProperty(this.formGroup.get('otherData').value, 'mobilePhone') ?
                            this.formGroup.get('otherData').value.mobilePhone.startsWith('+374') ? this.formGroup.get('otherData').value.mobilePhone :
                                '+374' + this.formGroup.get('otherData').value.mobilePhone : null,
                        // email: this._appService.checkProperty(this.formGroup.get('otherData').value, 'email'),
                        language: this._appService.checkProperty(this.formGroup.get('otherData').value, 'language'),
                        education: this._appService.checkProperty(this.formGroup.get('otherData').value, 'education'),
                        // this._appService.checkProperty(this._appService.checkProperty(this.formGroup.get('otherData').value, 'education'), 'name'),
                    },
                    employeePosition: employeePosition,
                    employeeAccounts: employeeAccounts,
                    employeeAddition: additions,
                    employeeHold: []
                    // holds
                }

                this._loadingService.showLoading()
                if (this._data.id) {
                    this._employeesService.updateEmployee(this._data.id, sendObject).subscribe((data) => {
                        this._loadingService.hideLoading()
                        this._componentDataService.offClick()
                        this._dialogRef.close({ value: true, id: this._data.id })
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                        this._componentDataService.offClick()
                    })
                } else {
                    this._employeesService.addEmployees(sendObject).subscribe((data) => {
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true })
                        this._componentDataService.offClick()

                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                        this._componentDataService.offClick()
                    })
                }
            }
        }

    }
    private _setFinalySendAdditonHolds(key: string, idKey: string) {
        let additionsOrHold = []
        if (this.formGroup.get(key).value) {
            if (this.formGroup.get(key).value.investmentExpenditureArray) {
                this.formGroup.get(key).value.investmentExpenditureArray.forEach((element) => {
                    let value = element.value
                    additionsOrHold.push({
                        [idKey]: this._appService.checkProperty(value.additionId, 'id'),
                        date: value.date ? this._datePipe.transform(value.date, 'yyyy-MM-dd') : null,
                        money: value.money,
                        isMain: value.isMain
                    })

                })
            }
            if (this.formGroup.get(key).value.byMonthArray) {
                this.formGroup.get(key).value.byMonthArray.forEach((element) => {
                    let value = element.value;
                    additionsOrHold.push({
                        [idKey]: this._appService.checkProperty(value.additionId, 'id'),
                        date: value.date ? this._datePipe.transform(value.date, 'yyyy-MM-dd') : null,
                        money: value.money,
                        isMain: value.isMain,
                        id: value.id
                    })

                })

            }
            if (key == 'hold') {
                if (this._deletedHold && this._deletedHold.length) {
                    this._deletedHold.forEach(element => {
                        additionsOrHold.push(element)
                    });
                }
            } else {
                if (this._deletedAddition && this._deletedAddition.length) {
                    this._deletedAddition.forEach(element => {
                        additionsOrHold.push(element)
                    });
                }
            }
        }

        return additionsOrHold
    }
    private _joinElements(obj1: Object, obj2: Object, obj3: Object): string | null {
        if (obj1 || obj2 || obj3) {
            let array = []
            array.push(obj1, obj2, obj3)
            return array.join(',')
        } else {
            return null
        }
    }

    private _checkIsValid(): boolean {
        return this._appService.checkIsValid(this._tabsItem)
    }

    public setValue(event, controlName: string, form: FormGroup = this.formGroup): void {
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName);
        if (controlName == 'type') {
            if (event && event.methodOfSallaryCalculation && +event.methodOfSallaryCalculation == 1) {
                this.openWeekDaysTable(form, null)
            } else {
                form.setControl('hoursInWeekDays', this._fb.array([]))
            }
        }

    }

    public setInputValue(controlName: string, property: string, form: FormGroup = this.formGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }

    ngOnDestroy() {
        this._oftenUsedParamsService.setAdditionEndDate(null)
        this._oftenUsedParamsService.setStartAdditionDate(null)

        this._oftenUsedParamsService.setHoldEndDate(null)
        this._oftenUsedParamsService.setStartHoldDate(null)
        this._loadingService.hideLoading()
        this._subscription.unsubscribe();
        this._subscription1.unsubscribe()
    }
    get tabsItem(): TabItem[] {
        return this._tabsItem
    }
    get getDateOfAccept() {
        return this._appService.checkProperty(this.formGroup.get('common').value, 'adoptionDate')
    }
    get employeeId(): number {
        return this._data.id
    }

}
import { Component, Input, Inject } from "@angular/core";
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { AppService, ComponentDataService, LoadingService, OftenUsedParamsService } from '../../../services';
import { Subscription } from 'rxjs';
import { Addition, ServerResponse, FilteredAddition } from '../../../models/global.models';
import { EmployeesService } from '../../../views/main/fixed-assets/pages/employees/employees.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-additive-retention',
    templateUrl: 'employee-additive-retention.component.html',
    styleUrls: ['employee-additive-retention.component.scss']
})
export class EmployeeAdditiveRetentionComponent {
    public modalParams = {
        tabs: ['Անվանում', 'Գործակից'], title: 'Աշխատավարձի տեսակ', keys: ['name', 'coefficient']
    }
    public dateOfAccept;
    public additionsGroup: FormGroup
    private _subscription: Subscription;
    public additions: Addition[] = []
    private _deletedGroupsArray = [];
    private _employeeId: number;
    private _key: string

    @Input('key')
    set setKey($event: string) {
        this._key = $event
    }
    @Input('additions')
    set setAdditions($event: Addition[]) {
        this.additions = $event
    }
    @Input('dateOfAccept')
    set setDateOfAccept($event) {
        this.dateOfAccept = $event
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.additionsGroup.patchValue({
                startDate: $event.startDate,
                endDate: $event.endDate,
                isInvestmentExpenditure: $event.isInvestmentExpenditure
            });
            this._setArrayValue('byMonthArray', $event.byMonthArray);
            this._setArrayValue('investmentExpenditureArray', $event.investmentExpenditureArray);
            this._appService.markFormGroupTouched(this.additionsGroup)
        }
    }
    @Input('employeeId')
    set setEmployeeId($event: number) {
        if ($event) {
            this._employeeId = $event;
            this.changeDate()
        }
    }


    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _employeesService: EmployeesService,
        private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _datePipe: DatePipe) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                if (this.additionsGroup) {
                    let isValid = (this.additionsGroup.get('byMonthArray').valid && this.additionsGroup.get('investmentExpenditureArray').valid) ? true : false;
                    console.log(this._deletedGroupsArray)
                    this._componentDataService.sendData(this.additionsGroup, this._key, isValid, this._deletedGroupsArray)
                    this._deletedGroupsArray = []
                }
            }
        })
    }
    private _setArrayValue(key: string, data) {
        if (data && data.length) {
            (this.additionsGroup.controls[key] as FormArray) = this._fb.array([])
            data.forEach(element => {
                (this.additionsGroup.get(key) as FormArray).push(element)
            });
        }
    }
    public checkInInvestmentExpenditure() {
        this.additionsGroup.get('isInvestmentExpenditure').setValue(true)
    }

    public changeDate() {
        let lastSartDate = this._key == 'addition' ? this._oftenUsedParamsService.getStartAdditionDate() : this._oftenUsedParamsService.getStartHoldDate();
        let lastEndDate = this._key == 'addition' ? this._oftenUsedParamsService.getAdditionEndDate() : this._oftenUsedParamsService.getHoldEndDate();;
        let start = this.additionsGroup.get('startDate').value;
        let end = this.additionsGroup.get('endDate').value;
        let startDateFormat = start ? this._datePipe.transform(start, 'yyyy-MM-dd') : 0;
        let endDateFormat = end ? this._datePipe.transform(end, 'yyyy-MM-dd') : 0;
        if (lastSartDate !== startDateFormat || lastEndDate !== endDateFormat || this.additionsGroup.get('isInvestmentExpenditure').value) {
            if (this._key == 'addition') {
                this._oftenUsedParamsService.setStartAdditionDate(startDateFormat)
                this._oftenUsedParamsService.setAdditionEndDate(endDateFormat)
            } else {
                this._oftenUsedParamsService.setStartHoldDate(startDateFormat)
                this._oftenUsedParamsService.setHoldEndDate(endDateFormat)
            }

            this.additionsGroup.get('isInvestmentExpenditure').setValue(false);
            if (startDateFormat && this._employeeId) {
                this._filterAdditions(startDateFormat, endDateFormat)
            }
        }
    }
    private _filterAdditions(startDateFormat, endDateFormat) {
        let idKey: string = this._key == 'addition' ? 'additionId' : 'holdId'
        this._loadingService.showLoading()
        this._employeesService.filterAddition(this._employeeId, this._key, startDateFormat, endDateFormat).subscribe((data: ServerResponse<FilteredAddition[]>) => {
            let additions = data.data;
            (this.additionsGroup.controls['byMonthArray'] as FormArray) = this._fb.array([])
            additions.forEach(element => {
                (this.additionsGroup.get('byMonthArray') as FormArray).push(this._fb.group({
                    additionId: this._fb.control(this._appService.checkProperty(this._appService.filterArray(this.additions, element[idKey], 'id'), 0), Validators.required),
                    name: this._fb.control(this._appService.checkProperty(this._appService.checkProperty(this._appService.filterArray(this.additions, element[idKey], 'id'), 0), 'name'), Validators.required),
                    money: this._fb.control(element.money, Validators.required),
                    isMain: this._appService.getBooleanVariable(element.isMain),
                    date: this._fb.control(new Date(element.date), Validators.required),
                    id: element.id
                }))
            });
            this._appService.markFormGroupTouched(this.additionsGroup)
            this._loadingService.hideLoading()
        })
    }
    private _validate(): void {
        this.additionsGroup = this._fb.group({
            startDate: [],
            endDate: [],
            isInvestmentExpenditure: false,
            byMonthArray: this._fb.array([]),
            investmentExpenditureArray: this._fb.array([])
        })
    }
    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.additionsGroup.get('investmentExpenditureArray') as FormArray;
            formArray.push(this._fb.group({
                additionId: [null],
                name: [null],
                money: [null],
                isMain: [false],
                date: [null],
                id: [null]
            }))
        }
    }

    public remove(index: number): void {
        let formArray = this._getActiveFormArray()
        if (formArray == this.additionsGroup.get('byMonthArray')) {
            console.log(formArray);
            let idKey = this._key == 'addition' ? 'additionId' : 'holdId'
            if (formArray.controls[index]['controls']['id'] && formArray.controls[index]['controls']['id'].value) {
                this._deletedGroupsArray.push({
                    [idKey]: this._appService.checkProperty(formArray.controls[index]['controls']['additionId'].value, 'id'),
                    date: this._datePipe.transform(formArray.controls[index]['controls']['date'].value, 'yyyy-MM-dd'),
                    money: formArray.controls[index]['controls']['money'].value,
                    isMain: formArray.controls[index]['controls']['isMain'].value,
                    id: formArray.controls[index]['controls']['id'].value,
                    isDeleted: true
                })
            }
        }
        formArray.removeAt(index)
    }
    public deleteAll(event: boolean): void {
        let formArray = this._getActiveFormArray()
        if (event && (this.additionsGroup && formArray.length)) {
            let index = formArray.length - 1;
            // this._deletedGroupsArray = this._appService.setDeletedFormArray(formArray, index)
            formArray.removeAt(index)
        }
    }
    public setYearRange() {
        return this._appService.setYearRange()
    }
    public save(item) {
        console.log(item);

    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public setValue(event, item: FormGroup): void {
        item.get('additionId').setValue(event, 'id');
        item.get('name').setValue(this._appService.checkProperty(event, 'name'));
        this.onFocus(item, 'additionId');
    }

    public setInputValue(item, controlName: string, property: string) {
        return this._appService.setInputValue(item, controlName, property)
    }
    private _getControl(key: string) {
        let formArray = this.additionsGroup.get(key) as FormArray;
        return formArray.controls
    }
    private _getActiveFormArray() {
        let formArray1 = this.additionsGroup.get('investmentExpenditureArray') as FormArray;
        let formArray2 = this.additionsGroup.get('byMonthArray') as FormArray
        return this.additionsGroup.get('isInvestmentExpenditure').value ? formArray1 : formArray2
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
    get isInvestmentExpenditure(): boolean {
        return this.additionsGroup.get('isInvestmentExpenditure').value
    }
    get activeControl() {
        return this.additionsGroup.get('isInvestmentExpenditure').value ? this._getControl('investmentExpenditureArray') : this._getControl('byMonthArray')
    }
} 
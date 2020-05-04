import { Component, Input, Inject } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Partner, AccountPlans, MaterialValues, DeletedFormArrayModel, BankAccount, ServerResponse } from '../../models/global.models';
import { Subscription } from 'rxjs';
import { ComponentDataService, OftenUsedParamsService, AppService, LoadingService } from '../../services';
import { DatePipe } from '@angular/common';
import { MainService } from '../../views/main/main.service';
import { MatDialog } from '@angular/material';
import { MainBankService } from '../../views/main/main-bank/main-bank-service';
import { DeptModal } from '../../modals';

@Component({
    selector: 'app-replenishment-common',
    templateUrl: 'replenishment-common.component.html',
    styleUrls: ['replenishment-common.component.scss']
})
export class ReplenishmentCommonComponent {
    public totalAmount: number = 0;
    public totalDept: number = 0
    public bankAccounts: BankAccount[] = []
    public partners: Partner[] = [];
    public operationSignificanse = [];
    private _isChange: boolean = false
    public chartAccounts: AccountPlans[] = []
    private _subscription: Subscription
    public unitOfMeasurements: MaterialValues[] = []
    public commonGroup: FormArray;
    private _deletedGroupsArray: DeletedFormArrayModel[] = [];
    private _date: string;
    private _key: string

    @Input('key')
    set setKey($event: string) {
        this._key = $event
    }
    @Input('date')
    set setDate($event) {
        this._date = $event ? this._datePipe.transform($event, 'yyyy-MM-dd') : null;
        if (this._date) {
            (this.commonGroup as FormArray).controls.forEach(element => {
                this._getGroups(this._appService.checkProperty(element.get('partner').value, 'id'), element)

            });

        }
    }

    private _exitSpecification = []
    @Input('exitSpecification')
    set setExitSpecification($event) {
        if ($event) {            
            this._exitSpecification = $event[0];
            this._isChange = true;
        }
    }

    @Input('chartAccounts')
    set setChartAccount($event: AccountPlans[]) {
        this.chartAccounts = $event
    }
    @Input('bankAccount')
    set setBankAccount($event: BankAccount[]) {
        this.bankAccounts = $event
    }
    @Input('operationSignificanse')
    set setOperationSignificanse($event) {
        this.operationSignificanse = $event
    }
    @Input('partners')
    set setPartners($event: Partner[]) {
        this.partners = $event;

    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            if ($event.length) {
                this.commonGroup = this._fb.array([]);
                $event.forEach(element => {

                    if (element.value.partnerAccountNumber && element.value.partnerAccountNumber.billingId) {
                        if (element.value.partner && element.value.partner.id)
                            this._mainService.getById(this._urls.partnerGetOneUrl, element.value.partner.id).subscribe((data: ServerResponse<Partner>) => {
                                let partnerById = data.data;
                                element.patchValue({
                                    partnerAccountNumber: this._appService.checkProperty(this._appService.filterArray(partnerById.billingAccounts, element.value.partnerAccountNumber.billingId, 'id'), 0),
                                    partnersAccountNumbersArray: partnerById.billingAccounts
                                })
                                // if (controlName == 'bankAccount') {
                                //     if (event) {
                                //         this._calculateCoefficient(event, form, 'partnerAccountNumber')
                                //     }
                                // }
                                // if (controlName == 'partnerAccountNumber') {
                                //     if (event) {
                                //         this._calculateCoefficient(event, form, 'bankAccount')
                                //     }
                                // }
                                if(this._appService.checkProperty(element.get('bankAccount').value,'currencyId') == this._appService.checkProperty(element.get('partnerAccountNumber').value,'currencyId')){
                                    element.get('coefficient').disable()
                                }
                                this._getGroups(this._appService.checkProperty(element.get('partner').value, 'id'), element);

                                this.commonGroup.push(element);
                                this._appService.markFormGroupTouched(element)
                            })

                    } else {
                        this.commonGroup.push(element);
                        this._appService.markFormGroupTouched(element)
                    }
                });

            }
            this._isChange = true;

            this.changeAmount();
            this.calculateToatalDept()
        }
    }



    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _loadingService: LoadingService,
        private _datePipe: DatePipe,
        private _matDialog: MatDialog,
        @Inject('URL_NAMES') private _urls,
        private _mainBankService: MainBankService,
        private _mainService: MainService) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let formArray = this.commonGroup as FormArray;
                let isValid = (formArray && formArray.valid) ? true : false;
                this._componentDataService.sendData(this.commonGroup, 'general', isValid, this._deletedGroupsArray)
                this._deletedGroupsArray = []
            }
        })
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.commonGroup = this._fb.array([
            this._fb.group({
                bankAccount: [null],
                transactionSignificance: [null],
                partner: [null],
                partnerAccountNumber: [null],
                amount: [0],
                dept: [0],
                sum: [0],
                bonus: [0],
                groupCount: this._fb.array([]),
                partnersAccountNumbersArray: [[]],
                coefficient: [null],
                allGroupCount: this._fb.array([]),
            })
        ])

    }

    public addRow(event: boolean): void {
        if (event) {
            let formArray = this.commonGroup as FormArray;
            formArray.push(this._fb.group({
                bankAccount: [null],
                transactionSignificance: [null],
                partner: [null],
                partnerAccountNumber: [null],
                amount: [0],
                dept: [0],
                sum: [0],
                bonus: [0],
                groupCount: this._fb.array([]),
                allGroupCount: this._fb.array([]),
                partnersAccountNumbersArray: [[]],
                coefficient: [null]
            }))
        }
    }
    public remove(index: number): void {
        let formArray = this.commonGroup as FormArray;
        this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
            this._deletedGroupsArray.push(data)
        })
        formArray.removeAt(index);
        this.changeAmount()
    }
    public deleteAll(event: boolean): void {
        let formArray = this.commonGroup as FormArray;
        if (event && (formArray && formArray.length)) {
            let index = formArray.length - 1;
            this._appService.setDeletedFormArray(formArray, index).forEach((data) => {
                this._deletedGroupsArray.push(data)
            })
            formArray.removeAt(formArray.length - 1);
            this.changeAmount();
        }
    }
    public calculateToatalDept() {
        let sum: number = 0;
        if (this.commonGroup && this.commonGroup.controls) {
            for (let item of this.commonGroup.controls) {
                if (item.get('sum').value) {
                    sum += (item.get('sum').value) ? +item.get('sum').value : 0
                }
            }
        }

        this.totalDept = sum
    }

    public changeAmount(): void {
        let sum: number = 0;
        if (this.commonGroup && this.commonGroup.controls) {
            for (let item of this.commonGroup.controls) {
                if (item.get('amount').value) {
                    sum += (item.get('amount').value) ? +item.get('amount').value : 0
                }
                if (item.get('amount').value > item.get('sum').value) {
                    let bonusAmount = item.get('amount').value - item.get('sum').value
                    item.patchValue({
                        dept: item.get('sum').value,
                        bonus: bonusAmount
                    })
                } else {
                    item.patchValue({
                        dept: item.get('amount').value,
                        bonus: 0
                    })
                }
                if (!this._isChange)
                    this._calculatePaidMoney(item)
            }
        }

        this.totalAmount = sum
    }

    public setValue(event, controlName: string, form: FormGroup): void {
        if (controlName == 'partner') {
            let partner = event;
            if (partner) {
                if (form.get(controlName).value !== event) {
                    let partnerById: Partner;
                    this._mainService.getById(this._urls.partnerGetOneUrl, partner.id).subscribe((data: ServerResponse<Partner>) => {
                        partnerById = data.data;
                        form.patchValue({
                            partnerAccountNumber: null,
                            partnersAccountNumbersArray: partnerById.billingAccounts
                        })
                    })

                    this._getGroups(partner.id, form);
                }
            }
        }

        if (controlName == 'bankAccount') {
            if (event) {
                this._calculateCoefficient(event, form, 'partnerAccountNumber')
            }
        }
        if (controlName == 'partnerAccountNumber') {
            if (event) {
                this._calculateCoefficient(event, form, 'bankAccount')
            }
        }
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)

    }
    private _calculateCoefficient(event, form: FormGroup, controlName: string) {
        let currenyId = event.currencyId
        if (form.get(controlName).value) {
            let partnerAccount = form.get(controlName).value
            if (currenyId == partnerAccount.currencyId) {
                form.get('coefficient').setValue(1);
                form.get('coefficient').disable()
            } else {
                form.get('coefficient').setValue(null);
                form.get('coefficient').enable()
            }
        }
    }
    private _getGroups(partnerId: number, form) {
        if (this._date && partnerId)
            this._mainBankService.getGroups(partnerId, this._date).subscribe((data: ServerResponse<any>) => {
                let sum = 0;
                let groupCountArray = [];
                let creditArray = []
                data.data[this._key].forEach((credit) => {
                    sum += credit.money - credit.degrees;
                    let array = [];
                    let newCredit = credit;
                    newCredit['sum'] = 0
                    creditArray.push(newCredit)
                    let title: string;
                    if (credit.receivedServicesOperations.length) {
                        title = "Ստացված ծառայություններ"
                        array = credit.receivedServicesOperations
                    }
                    if (credit.salaryOperation.length) {
                        title = "Աշխատավարձ"
                        array = credit.salaryOperation
                    }
                    if (credit.warehouseEntryOrderOperation.length) {
                        title = "Պահեստի մուտքի օրդեր"
                        array = credit.warehouseEntryOrderOperation
                    }
                    if (credit.warehouseExitOrderOperation.length) {
                        title = "Պահեստի ելքի օրդեր"
                        array = credit.warehouseExitOrderOperation
                    }

                    array.forEach((dept) => {
                        groupCountArray.push({
                            id: credit.id,
                            title: title,
                            date: this._datePipe.transform(dept.date, 'yyyy-MM-dd'),
                            documentNumber: dept.documentNumber,
                            deptSum: credit.money - credit.degrees,
                            amount: 0,
                            paidMoney: 0,
                        })
                    })
                });
                
                groupCountArray.forEach((data) => {
                    if (this._exitSpecification && this._exitSpecification.length) {
                        this._exitSpecification.forEach((exitSpecification) => {
                          
                            if (data.id == exitSpecification.degrees.operationId) {
                                data.paidMoney += exitSpecification.money
                            }
                        })
                    }
                });
                (form.get('allGroupCount') as FormArray).clear()
                creditArray.forEach((val) => {
                    (form.get('allGroupCount') as FormArray).push(this._fb.group(val))
                });
                (form.get('groupCount') as FormArray).clear()
                groupCountArray.forEach((val) => {
                    (form.get('groupCount') as FormArray).push(this._fb.group(val))
                });
                form.patchValue({
                    sum: sum
                })
                if (!form.get('amount').value || (form.get('amount').value && sum < form.get('amount').value)) {
                    form.patchValue({
                        amount: sum
                    })
                } 
                if ((this._exitSpecification && !this._exitSpecification.length) || !this._exitSpecification)
                    this._calculatePaidMoney(form)
                this._loadingService.hideLoading()
            })
    }


    private _calculatePaidMoney(item) {

        let groupArray = item.get('groupCount').value;
        let allGroupArray = item.get('allGroupCount').value
        groupArray.forEach((val) => {
            val.amount = 0;
            val.paidMoney = 0;
        })
        allGroupArray.forEach((val) => {
            val.sum = 0
        })
        item.get('groupCount').value.forEach((data) => {
            data.amount = item.get('dept').value
        })
        if (groupArray && groupArray.length) {
            let i = groupArray.length - 1;
            let currenctAmount = item.get('dept').value;
            while (currenctAmount !== 0) {
                if (currenctAmount > groupArray[i].deptSum) {
                    groupArray[i].paidMoney = groupArray[i].deptSum;
                    allGroupArray[i].sum = groupArray[i].deptSum
                } else {
                    groupArray[i].paidMoney = currenctAmount
                    allGroupArray[i].sum = currenctAmount
                }
                currenctAmount -= groupArray[i].paidMoney
                i--;
            }
        };
        (item.get('groupCount') as FormArray).clear()
        groupArray.forEach((val) => {
            (item.get('groupCount') as FormArray).push(this._fb.group(val))
        });
        (item.get('allGroupCount') as FormArray).clear()
        allGroupArray.forEach((val) => {
            (item.get('allGroupCount') as FormArray).push(this._fb.group(val))
        });

    }
    public setModalParams(title: string, keys: Array<string>, tabsArray: Array<string>) {
        let modalParams = { tabs: tabsArray, title: title, keys: keys };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form) {
        return this._appService.setInputValue(form, controlName, property)
    }
    public change2() {
        this._isChange = false
    }
    public selectGroup(item) {
        if (item.get('groupCount').value) {
            let dialog = this._matDialog.open(DeptModal, {
                width: '75vw',
                autoFocus: false,
                data: {
                    items: item.get('groupCount').value
                }
            })
            dialog.afterClosed().subscribe((result) => {
                if (result) {
                    this._isChange = true
                    let amount = result.amount
                    item.get('amount').setValue(amount);
                    (item.get('groupCount') as FormArray).clear()
                    result.array.forEach((val) => {
                        (item.get('groupCount') as FormArray).push(this._fb.group(val));
                        (item.get('allGroupCount') as FormArray).controls.forEach((group) => {
                            let value = group.value
                            if (value.id == val.id) {
                                value['sum'] = val.paidMoney.value
                            }
                        })

                    });
                }
            })
        }
    }
    public focus(item: FormGroup, controlName: string): void {
        this._appService.focus(item, controlName)
    }
    public blur(item: FormGroup, controlName: string): void {
        this._appService.blur(item, controlName)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }

}
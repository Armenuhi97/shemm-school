import { Component, Inject } from "@angular/core";
import { Validators, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, Group, Partner, DeletedFormArrayModel, DataCount, HeadPositionModel, AccountPositionModel, BankPayload, Currency } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { LoadingService, AppService, ComponentDataService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SelectByModal } from 'src/app/com/annaniks/shemm-school/shared/modals';
import { AddGroupModal } from '../add-group/add-group.modal';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-partner-modal',
    templateUrl: 'add-partner.modal.html',
    styleUrls: ['add-partner.modal.scss']
})
export class AddPartnerModal {
    private _error: string
    public title: string;
    public currencies: Currency[] = []
    public partnerGroup: FormGroup;
    private _activeTab: string;
    private _subscription: Subscription;
    public groups: Group[] = [];
    public banks: BankPayload[] = []
    public headPositions: HeadPositionModel[] = [];
    public accountPositions: AccountPositionModel[] = [];
    private _subscription1: Subscription;
    private _deletedAddress: DeletedFormArrayModel[] = [];
    private _deletedAccount: DeletedFormArrayModel[] = [];
    public modalParams = { tabs: ['Կուտակիչ', 'Անվանում'], title: 'Գործընկերների խմբեր', keys: ['accumulator', 'name'] }
    public tabsItem = [{ title: 'Ընդհանուր', isValid: true, key: 'common' }, { title: 'Հաշվարկային հաշիվներ', isValid: true, key: 'settlementAccount' },
    { title: 'Լրացուցիչ հասցեներ', isValid: true, key: 'aditionalAddress' },
    { title: 'Այլ', isValid: true, key: 'other' }]
    constructor(private _dialogRef: MatDialogRef<AddPartnerModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _fb: FormBuilder, private _loadingService: LoadingService,
        private _appService: AppService, private _mainService: MainService,
        private _componentDataService: ComponentDataService, private _matDialog: MatDialog,
        @Inject('URL_NAMES') private _urls,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _messageService: MessageService,
    ) { }

    ngOnInit() {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                if (data.isDeletedArray && data.isDeletedArray.length) {
                    if (data.type == 'aditionalAddress' && data.isDeletedArray) {
                        data.isDeletedArray.forEach(element => {
                            this._deletedAddress.push(element)
                        });
                    }
                    if (data.type == 'settlementAccount' && data.isDeletedArray) {
                        data.isDeletedArray.forEach(element => {
                            this._deletedAccount.push(element)
                        });
                    }
                }
                if (this.partnerGroup.get(data.type)) {
                    this.partnerGroup.get(data.type).setValue(data.data);
                    for (let i = 0; i < this.tabsItem.length; i++) {
                        if (this.tabsItem[i].key == data.type) {
                            this.tabsItem[i].isValid = data.isValid
                        }
                    }
                }
            }
        })
        this.title = this._data.title;
        this._validate()
    }
    public close(): void {
        this._dialogRef.close();
        this._componentDataService.offClick()
    }

    public getActiveTab($event): void {
        this._componentDataService.onClick()
        this._activeTab = $event.title
    }
    private _checkIsValid() {
        return this._appService.checkIsValid(this.tabsItem, 4)
    }
    public addGroup(): void {
        let dialog = this._matDialog.open(AddGroupModal, {
            width: '500px',
            data: { title: 'Գործընկերոջ խումբ (Նոր)', array: this.groups }
        });
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this._getGroupCount().subscribe()
            }
        })
    }
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getGroupCount(),
            this._getHeadPositionCount(),
            this._getAccountPositionCount(),
            this._mainService.getBankCount(),
            this._mainService.getCurrenciesCount()
        )
        this._subscription = combine.subscribe(() => {
            this.currencies = this._oftenUsedParamsService.getCurrency()
            this._getPartnerById()
        })
    }
    private _getPartnerById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<Partner>) => {
                let partner = data.data;
                let accounts = []
                partner.billingAccounts.forEach((element) => {
                    accounts.push(this._fb.group({
                        id: element.id,
                        currency: this._appService.checkProperty(element, 'currency'),
                        name: element.name,
                        isMain: this._appService.getBooleanVariable(element.isMain),
                        account: element.account
                    }))
                })
                let address = [];
                partner.additionalAddressePartners.forEach((element) => {
                    address.push(this._fb.group({ id: element.id, name: element.name }))
                })
                this.partnerGroup.patchValue({
                    hvhh: partner.hvhh,
                    name: partner.name,
                    // fullName: partner.fullName,
                    group: this._appService.checkProperty(this._appService.filterArray(this.groups, partner.groupId, 'id'), 0),
                    common: {
                        isAAHpayer: this._appService.getBooleanVariable(partner.aaHpayer),
                        legalAddress: partner.legalAddress,
                        worksAddress: partner.practicalAddress,
                        directorFullName: partner.headAah,
                        headPosition: this._appService.checkProperty(this._appService.filterArray(this.headPositions, partner.headPositionId, 'id'), 0),
                        accountantFullName: partner.accountantAah,
                        accountantPosition: this._appService.checkProperty(this._appService.filterArray(this.accountPositions, partner.accountantPositionId, 'id'), 0),
                        certificate: partner.certificateNumber,
                        passportNumber: partner.passportNumber,
                        purposePayment: partner.mainPurposeOfPayment,
                        phone: partner.phone,
                        email: partner.email,
                        contract: partner.contract,
                        contract_date: partner.dateContract ? new Date(partner.dateContract) : null,
                        discountPercentageSale: partner.percentageOfSalesDiscount
                    },
                    other: {
                        otherData: partner.anotherAdditionalInformation,
                        deliveryMethod: partner.anotherDeliveryTime,
                        fullName: partner.anotherFullname,
                        attorneyPowerNumber: partner.anotherCredentialsNumber,
                        attorneyPowerDate: partner.anotherCredentialsDate ? new Date(partner.anotherCredentialsDate) : null,
                    },
                    settlementAccount: accounts,
                    aditionalAddress: address
                })
                this._loadingService.hideLoading()
            })
        } else {
            this._loadingService.hideLoading()

        }

    }
    private _getGroupCount(): Observable<void> {
        return this._mainService.getCount(this._urls.groupsMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getGroup(data.data.count)
            })
        )
    }
    private _getGroup(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.groupsMainUrl, count, 0).pipe(
            map((data: ServerResponse<Group[]>) => {
                this.groups = data.data;
            })
        )
    }
    private _getHeadPositionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.headPositionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getHeadPosition(data.data.count)
            })
        )
    }
    private _getHeadPosition(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.headPositionMainUrl, count, 0).pipe(
            map((data: ServerResponse<HeadPositionModel[]>) => {
                this.headPositions = data.data;

            })
        )
    }

    private _getAccountPositionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.accountPositionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAccountPosition(data.data.count)
            })
        )
    }
    private _getAccountPosition(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.accountPositionMainUrl, count, 0).pipe(
            map((data: ServerResponse<AccountPositionModel[]>) => {
                this.accountPositions = data.data;
            })
        )
    }
    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    private _validate(): void {
        this.partnerGroup = this._fb.group({
            hvhh: [null],
            name: [null, Validators.required],
            // fullName: [null, Validators.required],
            group: [null, Validators.required],
            common: [null],
            other: [null],
            aditionalAddress: [[]],
            settlementAccount: [[]]
        })
        this._combineObservable()
    }

    public addPartner(): void {
        this._componentDataService.onClick();
        this._appService.markFormGroupTouched(this.partnerGroup);

        let additionalAddress = [];
        additionalAddress = this._appService.setArrayWithDeleteParams(this.partnerGroup, 'aditionalAddress', this._deletedAddress)
        let settlementAccount = [];

        if (this.partnerGroup.get('settlementAccount').value) {
            this.partnerGroup.get('settlementAccount').value.forEach((el) => {
                let element = el.value;
                let obj = {
                    account: element.account,
                    currencyId: this._appService.checkProperty(element.currency, 'id'),
                    isMain: element.isMain,
                    name: element.name,
                }
                if (element.id) {
                    obj['id'] = element.id
                }
                settlementAccount.push(obj)
            })
        }
        if (this._deletedAccount && this._deletedAccount.length) {
            this._deletedAccount.forEach(element => {
                settlementAccount.push(element)
            });
        }

        let sendObj = {
            hvhh: this.partnerGroup.get('hvhh').value,
            name: this.partnerGroup.get('name').value,
            // fullName: '',
            // this.partnerGroup.get('fullName').value,
            groupId: this._appService.checkProperty(this.partnerGroup.get('group').value, 'id'),
            headPositionId: this._appService.checkProperty(this._appService.checkProperty(this.partnerGroup.get('common').value, 'headPosition'), 'id'),
            accountantPositionId: this._appService.checkProperty(this._appService.checkProperty(this.partnerGroup.get('common').value, 'accountantPosition'), 'id'),
            AAHpayer: this._appService.checkProperty(this.partnerGroup.get('common').value, 'isAAHpayer') ? true : false,
            legalAddress: this._appService.checkProperty(this.partnerGroup.get('common').value, 'legalAddress'),
            practicalAddress: this._appService.checkProperty(this.partnerGroup.get('common').value, 'worksAddress'),
            headAAH: this._appService.checkProperty(this.partnerGroup.get('common').value, 'directorFullName'),
            accountantAAH: this._appService.checkProperty(this.partnerGroup.get('common').value, 'accountantFullName'),
            certificateNumber: this._appService.checkProperty(this.partnerGroup.get('common').value, 'certificate'),
            passportNumber: this._appService.checkProperty(this.partnerGroup.get('common').value, 'passportNumber'),
            mainPurposeOfPayment: this._appService.checkProperty(this.partnerGroup.get('common').value, 'purposePayment'),
            phone: this._appService.checkProperty(this.partnerGroup.get('common').value, 'phone') ?
                this.partnerGroup.get('common').value.phone.startsWith('+374') ? this.partnerGroup.get('common').value.phone : '+374' + this.partnerGroup.get('common').value.phone : null,
            email: this._appService.checkProperty(this.partnerGroup.get('common').value, 'email'),
            contract: this._appService.checkProperty(this.partnerGroup.get('common').value, 'contract'),
            dateContract: this._appService.checkProperty(this.partnerGroup.get('common').value, 'contract_date'),
            percentageOfSalesDiscount: this._appService.checkProperty(this.partnerGroup.get('common').value, 'discountPercentageSale'),
            anotherAdditionalInformation: this._appService.checkProperty(this.partnerGroup.get('other').value, 'otherData'),
            anotherDeliveryTime: this._appService.checkProperty(this.partnerGroup.get('other').value, 'deliveryMethod'),
            anotherFullname: this._appService.checkProperty(this.partnerGroup.get('other').value, 'fullName'),
            anotherCredentialsNumber: this._appService.checkProperty(this.partnerGroup.get('other').value, 'attorneyPowerNumber'),
            anotherCredentialsDate: this._appService.checkProperty(this.partnerGroup.get('other').value, 'attorneyPowerDate'),
            additionalAddressePartners: additionalAddress,
            billingAccounts: settlementAccount
        }
        if (this.partnerGroup.valid && this._checkIsValid()) {
            this._loadingService.showLoading()
            if (this._data.id) {
                this._mainService.updateByUrl(this._data.url, this._data.id, sendObj).subscribe((data) => {
                    this._componentDataService.offClick()
                    this._dialogRef.close({ value: true, id: this._data.id })
                },
                    (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                        this._componentDataService.offClick()
                    }
                )
            } else {
                this._mainService.addByUrl(this._data.url, sendObj).subscribe((data) => {
                    this._componentDataService.offClick()
                    this._dialogRef.close({ value: true })
                }, (err) => {
                    this._mainService.translateServerError(err)
                    this._loadingService.hideLoading()
                    this._componentDataService.offClick()
                })
            }
        }
    }
    public setValue(event, controlName: string): void {
        this.partnerGroup.get(this._urls.groupsGetOneUrl).setValue(event);
        this.onFocus(this.partnerGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.partnerGroup, controlName, property)
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()

        this._subscription.unsubscribe();
        this._subscription1.unsubscribe()
    }

    get getModalName() {
        return SelectByModal
    }
    get activeTab(): string {
        return this._activeTab
    }
    get error(): string {
        return this._error
    }


}
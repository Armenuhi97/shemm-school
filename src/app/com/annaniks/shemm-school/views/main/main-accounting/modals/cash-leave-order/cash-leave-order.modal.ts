import { Component, Inject } from "@angular/core";
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Partner, AnalyticalGroup, AccountPlans, ServerResponse, Currency, DataCount, CashRegisterPayload, ModalDataModel, OperationModel, JsonObjectType, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { AddPartnerModal } from '../add-partner/add-partner.modal';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ComponentDataService, AppService, LoadingService, OftenUsedParamsService } from 'src/app/com/annaniks/shemm-school/services';
import { MainService } from '../../../main.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'cash-leave-order-modal',
    templateUrl: 'cash-leave-order.modal.html',
    styleUrls: ['cash-leave-order.modal.scss']
})
export class CashRegisterLeaveOrder {
    private _group1: { url: string, name: string } = { url: this._urls.analyticGroup1MainUrl, name: '1' };
    private _group2: { url: string, name: string } = { url: this._urls.analyticGroup2MainUrl, name: '2' };
    private subscription: Subscription
    public title: string;
    public currencies: Currency[] = []
    public cashRegisters: CashRegisterPayload[] = []
    private _error: string;
    public isAdditionally: boolean
    public cashLeaveOrderGroup: FormGroup;
    public activeTab: string;
    private _analyticalGroup1: AnalyticalGroup[] = [];
    private _analyticalGroup2: AnalyticalGroup[] = []
    private _partners: Partner[] = [];
    private _chartAccounts: AccountPlans[] = []
    private _subscription1: Subscription;
    public calculationTypes: JsonObjectType[] = []
    public typeOfAcquisition: JsonObjectType[] = []

    constructor(private _dialogRef: MatDialogRef<CashRegisterLeaveOrder>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _oftenUsedParamsService: OftenUsedParamsService,
        private _fb: FormBuilder,
        private _messageService:MessageService,

        private _datePipe: DatePipe,
        private _matDialog: MatDialog,
        @Inject('URL_NAMES') private _urls) {
        this.title = this._data.title;
        this._validate()

    }
    ngOnInit() {
        this._setDataFromTabs()
    }

    private _getOperationArray(body): void {
        this._mainService.getOperationArray(this._urls.cashExitOrderFunctionUrl, body, this.cashLeaveOrderGroup, this._fb)

    }
    private _setForOperationObject() {
        let object = {
            cashRegisterId: this._appService.checkProperty(this.cashLeaveOrderGroup.get('boxOffice').value, 'id'),
            date: this._datePipe.transform((this.cashLeaveOrderGroup.get('date').value), 'yyyy-MM-dd'),
            documentNumber: this.cashLeaveOrderGroup.get('folderNumber').value,
            correspondentAccountId: this._appService.checkProperty(this.cashLeaveOrderGroup.get('correspondentAccount').value, 'account'),
            entryAccountId: this._appService.checkProperty(this.cashLeaveOrderGroup.get('dramAccount').value, 'account'),
            analiticGroup_1Id: this._appService.checkProperty(this.cashLeaveOrderGroup.get('analyticalGroup1').value, 'id'),
            analiticGroup_2Id: this._appService.checkProperty(this.cashLeaveOrderGroup.get('analyticalGroup2').value, 'id'),
            currencyId: this._appService.checkProperty(this.cashLeaveOrderGroup.get('currency').value, 'id'),
            amountCurrency1: this.cashLeaveOrderGroup.get('amountcurrency').value,
            amountCurrency2: this.cashLeaveOrderGroup.get('ADM').value,
            partnersId: this._appService.checkProperty(this.cashLeaveOrderGroup.get('partner').value, 'id'),
            provide: this._appService.checkProperty(this.cashLeaveOrderGroup.get('provide').value, 'id'),
            //
            code: this.cashLeaveOrderGroup.get('code').value,
            application: this.cashLeaveOrderGroup.get('application').value,
            otherInfo: this.cashLeaveOrderGroup.get('otherInfo').value,
            basis: this.cashLeaveOrderGroup.get('base').value,
        }
        return object
    }

    private _setDataFromTabs(): void {
        this._subscription1 = this._componentDataService.getDataState().subscribe((data) => {
            if (data) {
                this.cashLeaveOrderGroup.get(data.type).setValue(data.data);
            }

        })
    }

    public setOperationValue($event) {
        if ($event) {
            let object = this._setForOperationObject();
            this._getOperationArray(object)
        }
    }

    public close() {
        this._dialogRef.close()
    }

    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._mainService.getAnalyticGroupCount(this._group1),
            this._mainService.getAnalyticGroupCount(this._group2),
            this._mainService.getWarehouseCount(),
            this._mainService.getPartnerCount(),
            this._mainService.getAccountsPlan(),
            this._getCashRegisters(),
            this._getCurrenciesCount(),
            this._mainService.getCalculationTypes(),
            this._mainService.getTypeOfAcquisition(),
        )
        this.subscription = combine.subscribe((data) => {
            this._analyticalGroup1 = this._oftenUsedParamsService.getAnalyticalGroup1();
            this._analyticalGroup2 = this._oftenUsedParamsService.getAnalyticalGroup2()
            this._partners = this._oftenUsedParamsService.getPartners();
            this._chartAccounts = this._oftenUsedParamsService.getChartAccounts();
            this.calculationTypes = this._oftenUsedParamsService.getCalculationTypes();
            this.typeOfAcquisition = this._oftenUsedParamsService.getTypeOfAcquisition()
            this._generateDocumentNumber()
        })
    }
    private _generateDocumentNumber(): void {
        if (!this._data.id) {
          this._mainService.generateField('cash_register_exit', 'document_number').subscribe((data: ServerResponse<GenerateType>) => {
            this.cashLeaveOrderGroup.get('folderNumber').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
          }, () => { this._loadingService.hideLoading() })
        } else {
          this._loadingService.hideLoading()
        }
      }
    private _getCashRegisters(): Observable<ServerResponse<CashRegisterPayload[]>> {
        return this._mainService.getByUrl(this._urls.cashRegistersMainUrl, 0, 0).pipe(
            map((data: ServerResponse<CashRegisterPayload[]>) => {
                this.cashRegisters = data.data;
                return data
            })
        )
    }
    private _getCurrenciesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.currenciesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getCurrencies(data.data.count)
            })
        )
    }

    private _getCurrencies(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.currenciesMainUrl, count, 0).pipe(
            map((data: ServerResponse<Currency[]>) => {
                this.currencies = data.data;
            })
        )
    }
    private _validate() {
        this.cashLeaveOrderGroup = this._fb.group({
            boxOffice: [null, Validators.required],
            date: [this.setTodayDate(), Validators.required],
            folderNumber: [null, Validators.required],
            correspondentAccount: [null],
            dramAccount: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            currency: [null, Validators.required],
            amountcurrency: [null, Validators.required],
            ADM: [null, Validators.required],
            partner: [null],
            provide: [null, Validators.required],
            code: [null],
            base: [null],
            application: [null],
            otherInfo: [null],
            operation: [null]
        })
        this._combineObservable()
    }


    public save(): void {
        this._componentDataService.onClick();
        let operationArray = []
        if (this.cashLeaveOrderGroup.get('operation') && this.cashLeaveOrderGroup.get('operation').value) {
            this.cashLeaveOrderGroup.get('operation').value.forEach((element) => {
                let data = element.value;
                let object = this._appService.getOperationObject(data)
                operationArray.push(object)
            })
        }
        this._appService.markFormGroupTouched(this.cashLeaveOrderGroup);
        let sendObject = {};
        sendObject['main'] = this._setForOperationObject()
        sendObject['cashRegisterExitFunctions'] = operationArray;
        if (this.cashLeaveOrderGroup.valid) {
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
        }
    }

    public addPartner() {
        this._subscription1.unsubscribe()
        let title = 'Գործընկեր (Նոր)';
        let dialog = this._matDialog.open(AddPartnerModal, {
            width: '80vw',
            minHeight: '55vh',
            maxHeight: '85vh',
            data: { title: title, url: this._urls.partnerGetOneUrl },
            autoFocus: false,

        })
        dialog.afterClosed().subscribe((data) => {
            this._setDataFromTabs()
            if (data) {
                if (data.value) {
                    this._loadingService.showLoading()
                    this._mainService.getPartnerCount().subscribe(() => {
                        this._partners = this._oftenUsedParamsService.getPartners();
                        this._loadingService.hideLoading();
                    })

                }
            }
        })
    }
    public setTodayDate(): Date {
        let today = new Date();
        return today
    }
    public setValue(event, controlName: string): void {
        this.cashLeaveOrderGroup.get(controlName).setValue(event);
        this.onFocus(this.cashLeaveOrderGroup, controlName)

    }
    public setInputValue(controlName: string, property: string) {

        return this._appService.setInputValue(this.cashLeaveOrderGroup, controlName, property)
    }
    public setModalParams(title: string, property: string, keyName: string) {
        let modalParams = { tabs: [keyName, 'Անվանում'], title: title, keys: [property, 'name'] };
        return modalParams
    }

    public onFocus(form: FormGroup, controlName: string): void {
        form.get(controlName).markAsTouched()
    }
    public openOrCloseAdditionalInfo() {
        this.isAdditionally = !this.isAdditionally
    }
    public arrowStyle() {
        let style = {}
        if (this.isAdditionally) {
            style['transform'] = "rotate(180deg)"
        }
        return style
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this.subscription.unsubscribe()
        this._subscription1.unsubscribe()
    }
    get error(): string {
        return this._error
    }
    get partners(): Partner[] {
        return this._partners
    }
    get analyticalGroup1(): AnalyticalGroup[] {
        return this._analyticalGroup1
    }
    get analyticalGroup2(): AnalyticalGroup[] {
        return this._analyticalGroup2
    }
    get chartAccounts(): AccountPlans[] {
        return this._chartAccounts
    }

}
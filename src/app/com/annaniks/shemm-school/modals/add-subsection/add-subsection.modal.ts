import { Component, Inject } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ServerResponse, DataCount, ModalDataModel, AccountPlans, Types, Subsection, GenerateType } from '../../models/global.models';
import { AppService, LoadingService } from '../../services';
import { MainService } from '../../views/main/main.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'add-subsection-modal',
    templateUrl: 'add-subsection.modal.html',
    styleUrls: ['add-subsection.modal.scss']
})
export class AddSubsectionModal {
    private _error: string;
    public subsectionGroup: FormGroup;
    public title: string;
    private _subscription: Subscription;
    public accountPlans: AccountPlans[] = [];
    public types: Types[] = []
    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<AddSubsectionModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        private _messageService: MessageService,

        @Inject('URL_NAMES') private _urls
    ) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate();
    }
    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getAccountsPlanCount(),
            this._getTypesCount()
        )
        this._subscription = combine.subscribe((data) => {
            if (data) {
                this._getSubsectionById()
            }
        }   )
    }
    private _getAccountsPlanCount(): Observable<void> {
        return this._mainService.getCount(this._urls.accountPlanMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAccountsPlan(data.data.count)
            })
        )
    }
    private _getAccountsPlan(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.accountPlanMainUrl, count, 0).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.accountPlans = data.data;
            })
        )
    }

    private _getTypesCount(): Observable<void> {
        return this._mainService.getCount(this._urls.typesMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getTypes(data.data.count)
            })
        )
    }
    private _getTypes(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.typesMainUrl, count, 0).pipe(
            map((data: ServerResponse<Types[]>) => {
                this.types = data.data;
            })
        )
    }

    private _getSubsectionById(): void {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<Subsection>) => {
                if (data) {
                    this.subsectionGroup.patchValue({
                        code: data.data.code,
                        name: data.data.name,
                        expenseBuyer: this._appService.checkProperty(data.data, 'customerAccount'),
                        aahPayment: this._appService.checkProperty(data.data, 'aahAccount'),
                        prepaymentAccountReceived: this._appService.checkProperty(data.data, 'prepaidAccountReceived'),
                        type: this._appService.checkProperty(this._appService.filterArray(this.types, data.data.typesOfActionsId, 'id'), 0),
                    })
                }
                this._loadingService.hideLoading()
            })
        } else {
           this._generateDocumentNumber()
        }

    }
    private _generateDocumentNumber():void {
         this._mainService.generateField(this._data.url, 'code').subscribe((data: ServerResponse<GenerateType>)=>{
            this.subsectionGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        },
        ()=>{this._loadingService.hideLoading()})        
    }
    public close(): void {
        this._dialogRef.close()
    }
    private _validate(): void {
        this.subsectionGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            expenseBuyer: [null],
            aahPayment: [null],
            prepaymentAccountReceived: [null],
            type: [null]
        })
        this._combineObservable()
    }
    public addSubsection(): void {
        if (this._data.url) {
            this._appService.markFormGroupTouched(this.subsectionGroup)
            if (this.subsectionGroup.valid) {
                this._loadingService.showLoading()
                let sendObject = {
                    name: this.subsectionGroup.get('name').value,
                    code: this.subsectionGroup.get('code').value,
                    customerAccountId: this._appService.checkProperty(this.subsectionGroup.get('expenseBuyer').value, 'id'),
                    prepaidAccountReceivedId: this._appService.checkProperty(this.subsectionGroup.get('prepaymentAccountReceived').value, 'id'),
                    aahAccountId: this._appService.checkProperty(this.subsectionGroup.get('aahPayment').value, 'id'),
                    typesOfActionsId: this._appService.checkProperty(this.subsectionGroup.get('type').value, 'id'),
                }
                if (!this._data.id) {
                    this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true })
                    }, (err) => {
                       this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                } else {
                    this._mainService.updateByUrl(this._data.url, this._data.id, sendObject
                    ).subscribe((data) => {
                        this._loadingService.hideLoading()
                        this._dialogRef.close({ value: true, id: this._data.id })
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                }
            }
        }
    }
    public setValue(event, controlName: string, form: FormGroup = this.subsectionGroup) {
        form.get(controlName).setValue(event)

    }

    public setModalParams(title: string, codeKeyName: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [codeKeyName, 'name'] };
        return modalParams
    }
    public setInputValue(controlName: string, property: string, form = this.subsectionGroup) {
        return this._appService.setInputValue(form, controlName, property)
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
    get error(): string {
        return this._error
    }

}
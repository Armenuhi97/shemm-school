import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { MainService } from '../../../main.service';
import { AppService, LoadingService } from 'src/app/com/annaniks/shemm-school/services';
import { map } from 'rxjs/operators';
import { ServerResponse, Partner, Partners, AccountPlans, StructuralSubdivisionPayload, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
    selector: 'structural-subdivision-modal',
    templateUrl: 'structural-subdivision.modal.html',
    styleUrls: ['structural-subdivision.modal.scss']
})
export class StructuralSubdivisionModal {
    public structuralSubdivisionGroup: FormGroup;
    public title = 'Կառուցվածքային ստորաբաժանում (Նոր)';
    public serverResponseError: string = '';
    private _partnersUrl: string = 'partners';
    private _accountPlanMainUrl = 'account-plans'
    public partners = [];
    private _subscription: Subscription;
    public accountPlans: AccountPlans[] = [];
    public modalParamsPartner = { tabs: ['Կոդ', 'Անվանում'], title: 'Գործընկերներ', keys: ['id', 'name'] };
    public modalParamsAccount = { tabs: ['Կոդ', 'Անվանում'], title: 'Տեսակ', keys: ['account', 'name'] }

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data: { title: string, url: string, id?: number, item?: StructuralSubdivisionPayload },
        private _dialogRef: MatDialogRef<StructuralSubdivisionModal>,
        private _mainService: MainService,
        private _appService: AppService,
        private _loadingService: LoadingService,
        private _fb: FormBuilder) {
        this.title = this._data.title
    }

    ngOnInit() {
        this._validate();
        this._checkMatDialogData()
    }

    private _validate(): void {
        this.structuralSubdivisionGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            partnerId: [null],
            expenseAccountId: [null]
        })
        this._combineObservable()
    }

    public close(): void {
        this._dialogRef.close()
    }

    private _checkMatDialogData(): void {
        if (this._data.item) {
            console.log(this._data.item)
            const { code, name, expenseAccount, partners } = this._data.item
            this.structuralSubdivisionGroup.patchValue({
                code,
                name,
                partnerId: partners,
                expenseAccountId: expenseAccount
            })
        } else {
            this._generateCode()
        }
    }
    private _generateCode(): void {
        this._loadingService.showLoading()
        this._mainService.generateField('structural_subdivision', 'code').subscribe((data: ServerResponse<GenerateType>) => {
            if (data.data.message.maxColumValue !== 'null')
                this.structuralSubdivisionGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })
    }

    private _combineObservable(): void {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getPartnes(this._partnersUrl, 0, 0),
            this._getAccountPlans(this._accountPlanMainUrl, 0, 0)
        )
        this._subscription = combine.subscribe(() => this._loadingService.hideLoading())
    }


    private _getPartnes(url: string, limit: number, offset: number): Observable<ServerResponse<Partners[]>> {
        return this._mainService.getByUrl(url, limit, offset).pipe(
            map((data: ServerResponse<Partners[]>) => {
                this.partners = data.data;
                return data
            })
        )
    }

    private _getAccountPlans(url: string, limit: number, offset: number): Observable<ServerResponse<AccountPlans[]>> {
        return this._mainService.getByUrl(url, limit, offset).pipe(
            map((data: ServerResponse<AccountPlans[]>) => {
                this.accountPlans = data.data
                return data
            })
        )
    }
    // this._appService.checkProperty(this.warehouseSignificanceGroup.get('expenseAccountId').value, 'id'),
    public addStructuralSubdivision(): void {
        let structuralObject = this.structuralSubdivisionGroup;
        let sendingData: StructuralSubdivisionPayload = {
            code: structuralObject.get('code').value,
            name: structuralObject.get('name').value,
            partnerId: this._appService.checkProperty(structuralObject.get('partnerId').value, 'id'),
            expenseAccountId: this._appService.checkProperty(structuralObject.get('expenseAccountId').value, 'account')
        }
        if (this._data.id && this._data.item) {
            this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData)
                .subscribe(
                    (data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                    (error) => {
                        this.serverResponseError = error.error.data[0].message;
                    }
                )
        } else {
            this._mainService.addByUrl(`${this._data.url}`, sendingData)
                .subscribe((data) => { this._dialogRef.close({ value: true, id: this._data.id }) },
                    (error) => {
                        this.serverResponseError = error.error.data[0].message;
                    }
                )
        }
    }

    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.structuralSubdivisionGroup, controlName, property)
    }

    public setValue(event, controlName?): void {
        this.structuralSubdivisionGroup.get(controlName).setValue(event);
    }

    public setValues(event, controlName?): void {
        this.structuralSubdivisionGroup.get(controlName).setValue(event);
    }

    public setTypesValue(event, controlName?): void {
        if (event) {
            this.structuralSubdivisionGroup.get(controlName).setValue(event)
        }
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe()
        }
    }
}
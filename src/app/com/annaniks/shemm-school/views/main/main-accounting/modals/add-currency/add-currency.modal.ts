import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataModel, ServerResponse, Currency } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { AppService } from 'src/app/com/annaniks/shemm-school/services';
import { CurrencyService } from '../../pages/currency/currency.service';

@Component({
    selector: 'add-currency-modal',
    templateUrl: 'add-currency.modal.html',
    styleUrls: ['add-currency.modal.scss']
})
export class AddCurrencyModal {
    public title: string;
    public currencyGroup: FormGroup;
    constructor(private _dialogRef: MatDialogRef<AddCurrencyModal>,
        @Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _mainService: MainService, private _appService: AppService,
        private _fb: FormBuilder, private _currencyService: CurrencyService) {
        this.title = this._data.title
    }
    ngOnInit() {
        this._validate()
    }
    private _validate() {
        this.currencyGroup = this._fb.group({
            currency: [null, Validators.required],
            name: [null, Validators.required]
        })
        this._getCurrency()
    }
    private _getCurrency() {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<Currency>) => {
                this.currencyGroup.patchValue({
                    currency: data.data.currency,
                    name: data.data.name,
                })
            })
        }
    }
    public addCurrency() {
        this._appService.markFormGroupTouched(this.currencyGroup)
        if (this.currencyGroup.valid) {
            if (this._data.id) {
                this._currencyService.updateCurrency(this._data.id, this.currencyGroup.value).subscribe((data) => {
                    this._dialogRef.close({ value: true, id: this._data.id })
                })
            } else {
                this._currencyService.addCurrency(this.currencyGroup.value).subscribe((data) => {
                    this._dialogRef.close({ value: true })
                })
            }
        }
    }

    public close() {
        this._dialogRef.close()
    }

}
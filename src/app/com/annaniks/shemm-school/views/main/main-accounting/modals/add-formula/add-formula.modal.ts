import { Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Formulas, ServerResponse, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MainService } from '../../../main.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/com/annaniks/shemm-school/services';

@Component({
    selector: 'add-formula-modal',
    templateUrl: 'add-formula.modal.html',
    styleUrls: ['add-formula.modal.scss']
})
export class AddFormulaModal {
    public title: string = "Բանաձև";
    public formulaGroup: FormGroup;
    public serverResponseError = ''
    private _unsubscribe$: Subject<void> = new Subject<void>();
    constructor(
        // @Inject(MAT_DIALOG_DATA) private _data: { title?: string, id?: number, url?: string, item?: Formulas },
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _dialogRef: MatDialogRef<AddFormulaModal>,
        private _mainService: MainService,
        private _fb: FormBuilder,
        private _loadingService: LoadingService) { }

    ngOnInit() {
        this._validate();
        this._checkMatDialogData();
    }

    private _validate() {
        this.formulaGroup = this._fb.group({
            code: [null, Validators.required],
            caption: [null, Validators.required],
            expression: [null, Validators.required],
        })
    }

    public close() {
        this._dialogRef.close()
    }

    private _checkMatDialogData(): void {
        if (this._data.item) {
            const { code, caption, expression } = this._data.item;

            this.formulaGroup.patchValue({
                code, caption, expression
            })
        } else {
            this._generateCode()
        }
    }
    private _generateCode(): void {
        this._loadingService.showLoading()
        this._mainService.generateField('formulas', 'code').subscribe((data: ServerResponse<GenerateType>) => {
            if (data.data.message.maxColumValue !=='null')
                this.formulaGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })
    }

    public addFormula(): void {
        let sendingData: Formulas = this.formulaGroup.value;
        if (this._data.id && this._data.item) {
            this._mainService.updateByUrl(`${this._data.url}`, this._data.id, sendingData).pipe(takeUntil(this._unsubscribe$)
            ).subscribe(
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

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete()
    }
}
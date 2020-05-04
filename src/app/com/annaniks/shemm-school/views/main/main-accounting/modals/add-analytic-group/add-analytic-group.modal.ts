import { Component, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ServerResponse, ModalDataModel, DataCount, AnalyticalGroup, GenerateType } from 'src/app/com/annaniks/shemm-school/models/global.models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../../../main.service';
import { LoadingService, AppService } from 'src/app/com/annaniks/shemm-school/services';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api/';

@Component({
    selector: 'add-analytic-group-modal',
    templateUrl: 'add-analytic-group.modal.html',
    styleUrls: ['add-analytic-group.modal.scss']
})
export class AddAnalyticGroupModal {
    public formGroup: FormGroup;
    public title: string;
    private _error: string;
    public analyticalGroup: AnalyticalGroup[] = [];
    public modalParams = { tabs: ['Կոդ', 'Անվանում'], title: this._data.title, keys: ['code', 'name'] }
    private _accumulateKey: string;
    private _tableName:string;
    private _subscription: Subscription
    constructor(@Inject(MAT_DIALOG_DATA) private _data: ModalDataModel,
        private _dialogRef: MatDialogRef<AddAnalyticGroupModal>,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _loadingService: LoadingService,
        private _appService: AppService,
        private _messageService: MessageService,
        @Inject('URL_NAMES') private _urls
    ) {
        this.title = this._data.title;
        this._checkGroupNumber();
    }

    ngOnInit() {
        this._validate()
    }
    private _combineObservable() {
        this._loadingService.showLoading()
        const combine = forkJoin(
            this._getAnalyticalGroupCount()
        )
        this._subscription = combine.subscribe((data) => {
            if (data) {
                this._getAnalyticalGroupById()
            }
        })
    }
    private _checkGroupNumber() {
        if (this._data.url == this._urls.analyticGroup2GetOneUrl) {
            this._accumulateKey = 'analiticGroup2Id';
            this._tableName='analitic_group_2'
        } else {
            this._accumulateKey = 'analiticGroup1Id';
            this._tableName='analitic_group_1'

        }
    }
    private _getAnalyticalGroupCount(): Observable<void> {
        return this._mainService.getCount(this._data.mainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                return this._getAnalyticalGroup(data.data.count)

            })
        )
    }
    private _getAnalyticalGroup(count: number): Observable<void> {
        return this._mainService.getByUrl(this._data.mainUrl, count, 0).pipe(
            map((data: ServerResponse<AnalyticalGroup[]>) => {
                this.analyticalGroup = data.data;
            }
            )
        )
    }

    private _getAnalyticalGroupById() {
        if (this._data.id) {
            this._mainService.getById(this._data.url, this._data.id).subscribe((data: ServerResponse<any>) => {
                if (data) {
                    let group = data.data;
                    this.formGroup.patchValue({
                        code: group.code,
                        name: group.name,
                        isAccumulationGroup: this._appService.getBooleanVariable(group.isAccumulate),
                        accumulator: this._appService.checkProperty(this._appService.filterArray(this.analyticalGroup, group[this._accumulateKey], 'code'), 0)
                    })
                }
                this._loadingService.hideLoading()
            })
        } else {
            this._generateDocumentNumber()
        }
    }
    private _generateDocumentNumber(): void {
        this._mainService.generateField(this._tableName, 'code').subscribe((data: ServerResponse<GenerateType>) => {
            this.formGroup.get('code').setValue(data.data.message.maxColumValue);
            this._loadingService.hideLoading()
        }, () => { this._loadingService.hideLoading() })
    }

    public close() {
        this._dialogRef.close()
    }
    private _validate() {
        this.formGroup = this._fb.group({
            code: [null, Validators.required],
            name: [null, Validators.required],
            isAccumulationGroup: [false],
            accumulator: [null]
        })
        this._combineObservable()
    }
    public addAnalyticGroup() {
        if (this._data.url) {
            if (this.formGroup.valid) {
                this._loadingService.showLoading()
                let sendObject = {
                    code: this.formGroup.get('code').value,
                    name: this.formGroup.get('name').value,
                    isAccumulate: this.formGroup.get('isAccumulationGroup').value ? this.formGroup.get('isAccumulationGroup').value : false,
                    [this._accumulateKey]: this._appService.checkProperty(this.formGroup.get('accumulator').value, 'code')
                }

                if (!this._data.id) {
                    this._mainService.addByUrl(this._data.url, sendObject).subscribe((data) => {
                        this._dialogRef.close({ value: true })
                        this._loadingService.hideLoading()
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                } else {
                    this._mainService.updateByUrl(this._data.url, this._data.id, sendObject).subscribe((data) => {
                        this._dialogRef.close({ value: true, id: this._data.id });
                        this._loadingService.hideLoading()
                    }, (err) => {
                        this._mainService.translateServerError(err)
                        this._loadingService.hideLoading()
                    })
                }
            }
        }

    }
    public setValue(event) {
        this.formGroup.get('accumulator').setValue(event);
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.formGroup, controlName, property)
    }
    ngOnDestroy() {
        this._loadingService.hideLoading()
        this._subscription.unsubscribe()
    }
    get error() {
        return this._error
    }
}
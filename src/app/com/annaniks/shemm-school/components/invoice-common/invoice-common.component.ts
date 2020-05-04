import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService, ComponentDataService, AppService } from '../../services';
import { AddSubsectionModal } from '../../modals/add-subsection/add-subsection.modal';
import { MainService } from '../../views/main/main.service';
import { ServerResponse, DataCount, AnalyticalGroup, Subsection } from '../../models/global.models';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SelectDocumentTypeModal } from '../../modals';

@Component({
    selector: 'app-invoice-common',
    templateUrl: 'invoice-common.component.html',
    styleUrls: ['invoice-common.component.scss']
})
export class InvoiceCommonComponent {
    public invoiceGroup: FormGroup;
    public documentKind: Array<{ text: string, id: number }> = []
    public subsection:Subsection[] = [];
    public analyticalGroup1: AnalyticalGroup[] = [];
    public analyticalGroup2: AnalyticalGroup[] = []
    private _subscription: Subscription;
    @Input('group')
    set getFormGroup($event) {
        if ($event) {
            this.invoiceGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.invoiceGroup)
        }
    }

    @Input('subsections')
    set setSubsection($event) {
        this.subsection = $event
    }
    @Input('analyticalGroup1')
    set setAnalyticalGroup1($event:AnalyticalGroup[]) {
        this.analyticalGroup1 = $event
    }
    @Input('analyticalGroup2')
    set setAnalyticalGroup2($event:AnalyticalGroup[]) {
        this.analyticalGroup2 = $event
    }
    constructor(private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig, private _matDialog: MatDialog,
        private _loadingService: LoadingService, private _mainService: MainService,
        private _componentDataService: ComponentDataService,
        private _appService: AppService,
        @Inject('URL_NAMES') private _urls
    ) {
        this.documentKind = this._appService.getDocumentKind()
        this._validate();
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.invoiceGroup.valid ? true : false
                this._componentDataService.sendData(this.invoiceGroup.value, 'general', isValid)
            }
        })
    }

    private _validate() {
        this.invoiceGroup = this._fb.group({
            contract: [null],
            contractDate: [null],
            subsection: [null],
            analyticalGroup1: [null],
            analyticalGroup2: [null],
            series: [null],
            number: [null],
            dischargeDate: [null],
            comment: [null]
        })
    }
    public setModalParams(title: string) {
        let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: ['code', 'name'] };
        return modalParams
    }

    public onFocus( form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }
    private _getSubsectionCount(): Observable<void> {
        return this._mainService.getCount(this._urls.subsectionMainUrl).pipe(
            switchMap((data: ServerResponse<DataCount>) => {
                let count = data.data.count;
                return this._getSubvision(count);
            })
        )

    }
    private _getSubvision(count: number): Observable<void> {
        return this._mainService.getByUrl(this._urls.subsectionMainUrl, count, 0).pipe(
            map((data: ServerResponse<Subsection[]>) => {
                this.subsection = data.data;
            })
        )
      
    }

    public addSubsection() {
        let title = 'Ենթաբաժին (Նոր)';
        let dialog = this._matDialog.open(AddSubsectionModal, {
            width: '80vw',
            minHeight: '40vh',
            maxHeight: '85vh',
            autoFocus: false,
            data: { title: title, url: this._urls.subsectionGetOneUrl },

        })
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                if (data.value) {
                    this._loadingService.showLoading()
                    this._getSubsectionCount().subscribe(() => { this._loadingService.hideLoading() })
                }
            }
        })
    }
    public setValue(event, controlName:string) {
            this.invoiceGroup.get(controlName).setValue(event);
            this.onFocus(this.invoiceGroup,controlName)

    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.invoiceGroup, controlName, property)
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
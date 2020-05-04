import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Addition, ShortModel, ServerResponse, DataCount, AccountPlans, JsonObjectType } from '../../../models/global.models';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { ComponentDataService, AppService, LoadingService } from '../../../services';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { MainService } from '../../../views/main/main.service';
import { AddUnitModal } from '../../../views/main/fixed-assets/modals';
@Component({
    selector: 'app-employee-common',
    templateUrl: 'employee-common.component.html',
    styleUrls: ['employee-common.component.scss']
})
export class EmployeeCommonComponent {
    public employeeGroup: FormGroup;
    public additions: Addition[] = [];
    public professions: ShortModel[] = [];
    public contracts = [];
    public accountPlans: AccountPlans[] = [];
    private _subscription: Subscription;
    private _subscription1: Subscription
    public genders: ShortModel[] = []
    public stampFee: JsonObjectType[] = []
    @Input('accountPlans')
    set setAccountPlans($event: AccountPlans[]) {
        if ($event) {
            this.accountPlans = $event;
            this.employeeGroup.get('paymentAccount').setValue(this.accountPlans[0])
        }
    }
    @Input('stampFee')
    set setStampFee($event: JsonObjectType[]) {
        if ($event)
            this.stampFee = $event;
            this.employeeGroup.get('stampFee').setValue(this._appService.checkProperty(this._appService.filterArray(this.stampFee,1,'id'),0))
    }
    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this._appService.markFormGroupTouched(this.employeeGroup)
            this.employeeGroup.patchValue($event);
            this.setCumulativeParticipantValue($event.birthday);
        }
    }


    @Input('genders')
    set setGenders($event: ShortModel[]) {
        if ($event) {
            this.genders = $event
        }
    }
    @Input('additions')
    set setAdditions($event: Addition[]) {
        this.additions = $event
    }
    @Input('profession')
    set setProfessions($event: ShortModel[]) {
        this.professions = $event;
    }
    @Input('contracts')
    set setContracts($event) {
        this.contracts = $event
    }
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig,
        private _appService: AppService,
        private _fb: FormBuilder, private _componentDataService: ComponentDataService, private _matDialog: MatDialog,
        private _mainService: MainService, private _loadinService: LoadingService,
        @Inject('URL_NAMES') private _urls) {
        this._validate()
    }
    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                this._appService.markFormGroupTouched(this.employeeGroup)
                let isValid = this.employeeGroup.valid;
                let generalObject = this.employeeGroup.value;
                // let formArray = this.employeeGroup.get('paymentType') as FormArray;
                // generalObject.paymentType = formArray.controls
                this._componentDataService.sendData(generalObject, 'common', isValid)
            }
        })
    }
    private _combineObservable() {
        this._loadinService.showLoading()
        const combine = forkJoin(
            this._getProfessionsCount()
        )
        this._subscription1 = combine.subscribe(() => this._loadinService.hideLoading())
    }
    private _getProfessionsCount() {
        return this._mainService.getCount(this._urls.professionMainUrl).pipe(
            map((data: ServerResponse<DataCount>) => {
                return this._getProfessions(data.data.count)
            })
        )
    }
    private _getProfessions(count: number): Observable<ServerResponse<ShortModel[]>> {
        return this._mainService.getByUrl(this._urls.professionMainUrl, count, 0).pipe(
            map((data: ServerResponse<ShortModel[]>) => {
                this.professions = data.data
                return data
            })
        )
    }
    private _validate(): void {        
        this.employeeGroup = this._fb.group({
            profession: [null],
            gender: [null],
            birthday: [null],
            contractType: [null],
            // addition: [null],
            adoptionDate: [null],
            orderAdmissionWork: [null],
            releaseDate: [null],
            dismissalOrder: [null],
            isCumulativeParticipant: [null],
            paymentAccount: [null,Validators.required],
            stampFee:[null,Validators.required]
  
        })

    }
  
    // public setModalParams(title: string, key: string) {
    //     let modalParams = { tabs: ['Կոդ', 'Անվանում'], title: title, keys: [key, 'name'] }
    //     return modalParams
    // }

    public setModalParams(title: string, titlesArray: Array<string>, keysArray: Array<string>): object {
        let modalParams = { tabs: titlesArray, title: title, keys: keysArray };
        return modalParams
    }
    public addProfession(): void {
        let dialog = this._matDialog.open(AddUnitModal,
            {
                width: '500px',
                data: { title: 'Մասնագիտություն (Նոր)', url: this._urls.professionGetOneUrl, array: this.professions },
                autoFocus: false,
            })
        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this._combineObservable()
            }
        })

    }
    public setYearRange(startDate): string {
        let currencydate = new Date();
        let currencyYear = currencydate.getFullYear();
        return `${startDate}:${currencyYear}`
    }
    public onFocus(form: FormGroup, controlName: string) {
        form.get(controlName).markAsTouched()
    }
    public setCumulativeParticipantValue($event): void {
        if ($event) {
            let date = new Date($event);
            let year = date.getFullYear();
            if (year >= 1974) {
                this.employeeGroup.get('isCumulativeParticipant').setValue('այո')
            } else {
                this.employeeGroup.get('isCumulativeParticipant').setValue('ոչ')
            }
        } else {
            this.employeeGroup.get('isCumulativeParticipant').setValue(null)
        }
    }

    public setValue(event, controlName: string, form: FormGroup = this.employeeGroup): void {        
        form.get(controlName).setValue(event);
        this.onFocus(form, controlName)
    }
    public setInputValue(controlName: string, property: string, form = this.employeeGroup) {                
        return this._appService.setInputValue(form, controlName, property)
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
        if (this._subscription1)
            this._subscription1.unsubscribe()
    }
}
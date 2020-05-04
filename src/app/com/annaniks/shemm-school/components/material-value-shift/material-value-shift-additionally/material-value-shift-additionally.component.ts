import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppService, ComponentDataService } from '../../../services';
import { SelectDocumentTypeModal } from '../../../modals';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-material-value-shift-additionally',
    templateUrl: 'material-value-shift-additionally.component.html',
    styleUrls: ['material-value-shift-additionally.component.scss']
})
export class MaterialValueShiftAdditionallyComponent {
    public additionallyGroup: FormGroup;
    public documentKind = []
    private _subscription: Subscription
    @Input('group')
    set getFormGroup($event) {
        if ($event) {
            this.additionallyGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.additionallyGroup)
        }
    }
    constructor(private _fb: FormBuilder, private _appService: AppService,
        private _componentDataService: ComponentDataService,
        @Inject('CALENDAR_CONFIG') public calendarConfig, ) {
        this.documentKind = this._appService.getDocumentKind()
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.additionallyGroup.valid ? true : false
                this._componentDataService.sendData(this.additionallyGroup.value, 'additionally', isValid)
            }
        })
    }
    private _validate() {
        this.additionallyGroup = this._fb.group({
            chiefAccountant: [null],
            intermediary: [null],
            allowed: [null],
            // registration_books_number:[null],
            // page_number:[null],
            // line_number:[null],
            // dischargeMethod:[null],
            series: [null],
            number: [null],
            discharge_date: [null],
            comment: [null]
        })
    }
    public setValue(event, controlName:string):void {
            this.additionallyGroup.get(controlName).setValue(event);
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.additionallyGroup, controlName, property)
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
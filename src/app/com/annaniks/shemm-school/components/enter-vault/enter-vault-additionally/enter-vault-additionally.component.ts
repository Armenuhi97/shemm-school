import { Component, Inject, Input } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentDataService, AppService } from '../../../services';
import { SelectDocumentTypeModal } from '../../../modals';

@Component({
    selector: 'app-enter-vault-additionally',
    templateUrl: 'enter-vault-additionally.component.html',
    styleUrls: ['enter-vault-additionally.component.scss']
})
export class EnterVaultAdditionallyComponent {
    public additionGroup: FormGroup;
    private _subscription: Subscription
    public documentKind = []
 
    @Input('group')
    set getFormGroup($event) {
        if ($event) {
            this.additionGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.additionGroup)
        }
    }
    constructor(private _fb: FormBuilder,
        @Inject('CALENDAR_CONFIG') public calendarConfig, private _componentDataService: ComponentDataService,
        private _appService: AppService
    ) {
        this.documentKind = this._appService.getDocumentKind()
        this._validate()

    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.additionGroup.valid ? true : false
                this._componentDataService.sendData(this.additionGroup.value, 'additionally', isValid)
            }
        })
    }
    private _validate() {
        this.additionGroup = this._fb.group({
            proxy: [null],
            intermediary: [null],
            carType: [null],
            chiefAccountant: [null],
            allowed: [null],
            taken: [null],
            transportDocumentationNumber: [null],
            date: [null]
        })
    }
    public setValue(event, controlName) {
            this.additionGroup.get(controlName).setValue(event);
    }
    public setInputValue(controlName: string, property: string) {
        return this._appService.setInputValue(this.additionGroup, controlName, property)
    }
    public getModalName() {
        return SelectDocumentTypeModal
    }
    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
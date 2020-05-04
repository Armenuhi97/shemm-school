import { Component, Input } from "@angular/core";
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppService, ComponentDataService } from '../../../services';
import { SelectDocumentTypeModal } from '../../../modals';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-out-vault-additionally',
    templateUrl: 'out-vault-additionally.component.html',
    styleUrls: ['out-vault-additionally.component.scss']
})
export class OutVaultAdditionallyComponent {
    public additionGroup: FormGroup;
    public documentKind = []
    private _subscription: Subscription

    @Input('group')
    set getFormGroup($event) {
        if ($event) {            
            this.additionGroup.patchValue($event);
            this._appService.markFormGroupTouched(this.additionGroup)
        }
    }
    constructor(
        private _fb: FormBuilder,
        private _appService: AppService,
        private _componentDataService: ComponentDataService,
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
            demanded: [null]
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
    ngOnDestroy(){
        this._subscription.unsubscribe()
    }
}
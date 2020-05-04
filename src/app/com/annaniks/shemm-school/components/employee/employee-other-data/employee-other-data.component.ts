import { Component, Inject, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentDataService } from '../../../services';
import { Subscription } from 'rxjs';
import { ShortModel } from '../../../models/global.models';

@Component({
    selector: 'app-employee-other-data',
    templateUrl: 'employee-other-data.component.html',
    styleUrls: ['employee-other-data.component.scss']
})
export class EmployeeOtherDataComponent {
    public employeeGroup: FormGroup;
    private _subscription: Subscription;
    public identityDocumentTypes: ShortModel[] = [];
    public educations: ShortModel[] = [];
    @Input('identityDocumentTypes')
    set setDocumentTypes($event: ShortModel[]) {
        if ($event) {
            this.identityDocumentTypes = $event
        }
    }
    @Input('educations')
    set seteducations($event: ShortModel[]) {
        if ($event) {
            this.educations = $event
        }
    }

    @Input('group')
    set setFormGroup($event) {
        if ($event) {
            this.employeeGroup.patchValue($event)
        }
    }
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig, private _fb: FormBuilder, private _componentDataService: ComponentDataService) {
        this._validate()
    }

    ngOnInit() {
        this._subscription = this._componentDataService.getState().subscribe((data) => {
            if (data.isSend) {
                let isValid = this.employeeGroup.valid ? true : false
                this._componentDataService.sendData(this.employeeGroup.value, 'otherData', isValid)
            }
        })
    }

    private _validate(): void {
        this.employeeGroup = this._fb.group({
            bankAccount: [null],
            socialCard: [null],
            identityDocumentType: [null],
            identityDocumentNumber: [null],
            issueDate: [null],
            personIssue: [null],
            nationality: [null],
            otherDocument: [null],
            phone: [null],
            mobilePhone: [null],
            language: [null],
            education: [null],
            // email: [null,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)],

        })
    }

    ngOnDestroy() {
        this._subscription.unsubscribe()
    }
}
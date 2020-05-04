import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'availability-certificate-modal',
    templateUrl: 'availability-certificate.modal.html',
    styleUrls: ['availability-certificate.modal.scss']
})
export class AvailabilityCertificateModal {
    public title: string;
    private _activeTab: string;
    public filterGroup: FormGroup;
    public cashEntryOrderGroup: FormGroup;
    public isAdditionally: boolean;
    public availableItems = {
        'Նյութական արժեք': [
            {
                id: 1,
                name: 'Լրիվ անվանում'
            },
            {
                id: 2,
                name: 'Մեծածախ գին դրամով'
            },
            {
                id: 3,
                name: 'Գծիկավոր կոդ'
            }
        ],

    }
    public tabsItem: string[] = ['Ընդհանուր', 'Սյուները']
    constructor(private _dialogRef: MatDialogRef<AvailabilityCertificateModal>,
        @Inject(MAT_DIALOG_DATA) private _data: { label: string },
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _fb: FormBuilder) { }
    ngOnInit() {
        this.title = this._data.label;
    }
    public close(ev) {
        if (ev) {
            this._dialogRef.close()
        }
    }
    public getActiveTab(event: string) {
        this._activeTab = event

    }
    get activeTab(): string {
        return this._activeTab
    }
}
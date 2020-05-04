import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'turnover-modal',
    templateUrl: 'turnover.modal.html',
    styleUrls: ['turnover.modal.scss']
})
export class TunoverModal {
    public title: string;
    private _activeTab: string;
    public filterGroup: FormGroup;
    public cashEntryOrderGroup: FormGroup;
    public isAdditionally: boolean;
    public availableItems = {
        'Գործընկերներ': [
            {
                id: 1,
                name: 'ՀՎՀՀ'
            },
            {
                id: 2,
                name: 'խումբ'
            },
            {
                id: 3,
                name: 'խմբի անվանում'
            },
            {
                id: 4,
                name: 'Էլ․ փոստ'
            },
            {
                id: 5,
                name: 'Հաշվարկային հաշիվ 1'
            },
            {
                id: 6,
                name: 'Հաշվարկային հաշիվ 2'
            },

        ],

    }
    public tabsItem: string[] = ['Ընդհանուր', 'Սյուները']
    constructor(private _dialogRef: MatDialogRef<TunoverModal>,
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
import { Component, Inject, Input } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { DateListModal } from '../../modals';

@Component({
    selector: 'app-date',
    templateUrl: 'date.component.html',
    styleUrls: ['date.component.scss']
})
export class DateComponent {
    @Input('labelName') private _labelName:string='Ամսաթիվ'
    constructor(@Inject('CALENDAR_CONFIG') public calendarConfig, private _matDialog: MatDialog) { }
    public openCalendar() {
        this._matDialog.open(DateListModal, {
            width: '500px',
            minHeight:'65vh',
            autoFocus: false,

        })
    }
    get labelName():string{
        return this._labelName
    }
}
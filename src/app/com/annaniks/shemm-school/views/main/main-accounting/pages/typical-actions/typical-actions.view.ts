import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AddTypicalActionsModal } from '../../modals';

@Component({
    selector: 'typical-actions-view',
    templateUrl: 'typical-actions.view.html',
    styleUrls: ['typical-actions.view.scss']
})
export class TypicalActionView {
    public titles = [
        {
            title: 'Կոդ',
            isSort: false,
            arrow: 'arrow_drop_down',
            min: false,
            max: true
        },
        {
            title: 'Անվանում',
            isSort: false,
            arrow: '',
            min: false,
            max: false
        }

       

    ]
    constructor(private _matDialog: MatDialog,private _title:Title) {
        this._title.setTitle('Տիպային գործողություններ')
     }
    ngOnInit() { }
    public addTypicalAction() {
        this.openModal()
    }
    public openModal() {
        this._matDialog.open(AddTypicalActionsModal, {
            width: '80vw',
            minHeight: '60vh',
            maxHeight: '85vh',
            autoFocus: false
        })
    }
 }
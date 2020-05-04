import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'select-document-modal',
    templateUrl: 'select-document.modal.html',
    styleUrls: ['select-document.modal.scss']
})
export class SelectDocumentModal {
    public title: string;
    public documentArray = [{ isSelect: false, type: 51, comment: 'Հաստատել հավելում/պահումը' }]
    constructor(
        @Inject('CALENDAR_CONFIG') public calendarConfig,
        private _dialogRef: MatDialogRef<SelectDocumentModal>,
        @Inject(MAT_DIALOG_DATA) private _date) {
        this.title = 'Փատաթղթերի տեսակները'
    }
    ngOnInit() {
    }
    public select(item) {
        item.isSelect = !item.isSelect
    }
    public close(event) {
        this._dialogRef.close()
    }
    public save() {
        let selectedItem;
        for(let item of this.documentArray){
            if(item.isSelect){
                selectedItem=item
            }
        }        
        this._dialogRef.close(selectedItem)
    }
}
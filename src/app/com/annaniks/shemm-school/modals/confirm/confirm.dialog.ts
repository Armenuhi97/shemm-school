import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
@Component({
    selector: 'app-confirm',
    templateUrl: 'confirm.dialog.html',
    styleUrls: ['confirm.dialog.scss']
})
export class ConfirmModal implements OnInit {
    public text: string

    constructor(
        public dialogRef: MatDialogRef<ConfirmModal>,
        private _router: Router,
        @Inject(MAT_DIALOG_DATA) private _data: { text: string, link: number }
    ) {
        this.text = this._data.text
    }

    ngOnInit() { }

    public navigate() {
        window.open(`salary/salaries-list/${this._data.link}`, '_blank');
        // this._router.navigate([`salary/salaries-list/${this._data.link}`,'_blank'])
    }
    public onClickYes() {
        this.dialogRef.close(true);
    }
    public close(){
        this.dialogRef.close()
    }

}
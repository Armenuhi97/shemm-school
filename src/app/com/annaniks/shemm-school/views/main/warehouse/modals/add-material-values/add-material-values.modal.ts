import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClassificationModal } from '../classification/classification.modal';

@Component({
    selector: 'add-material-values-modal',
    templateUrl: 'add-material-values.modal.html',
    styleUrls: ['add-material-values.modal.scss']
})
export class AddMaterialValueModal {
    public title: string = 'Ավելացնել նոր ապրանք'
    constructor(private _dalogRef: MatDialogRef<ClassificationModal>,
        private _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private _data) { }

    public close() {
        this._dalogRef.close()
    }

    public openModal() {
        this._matDialog.open(ClassificationModal, {
            width: '80vw',
            maxHeight: '85vh',
            data: this._data
        })
    }


}
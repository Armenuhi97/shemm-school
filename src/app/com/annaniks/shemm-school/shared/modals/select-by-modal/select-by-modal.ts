import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../../services';

@Component({
    selector: 'select-by-modal',
    templateUrl: 'select-by-modal.html',
    styleUrls: ['select-by-modal.scss']
})
export class SelectByModal {
    public title: string;
    public selectedElement;
    public items = []
    constructor(private _dialogRef: MatDialogRef<SelectByModal>,
        private _appService: AppService,
        @Inject(MAT_DIALOG_DATA) private _data: { array: any[], params: { tabs: string[], title: string, keys: [], }, inputValue: any, selectObjectId: any, property: string }) {
        this.items = this._data.array;
        let element = this._appService.checkProperty(this._appService.filterArray(this._data.array, this._data.selectObjectId, this._data.property), 0, null)
        this.selectedElement = element ? element : this._appService.checkProperty(this._appService.filterArray(this._data.array, this._data.selectObjectId, 'id'), 0, null)
        // if(this.selectedElement){
        //     this._scroll(this.selectedElement.id)
        // }
        this.title = this._data.params.title
    }
    private _scroll(id: any): void {
        let element = document.getElementById(id);
        console.log(id);
        console.log(element);


        if (element)
            element.scrollIntoView({ behavior: 'smooth', });
    }
    public close(event) {
        if (event)
            this._dialogRef.close()
    }

    public select(item) {
        this._dialogRef.close(item)
    }
    get modalTitle() {
        return this._data.params.title
    }
    get tableTitle() {
        return this._data.params.tabs
    }
    get tableKeys() {
        return this._data.params.keys
    }
}
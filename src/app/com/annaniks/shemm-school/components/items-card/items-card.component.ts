import { Component, Input } from "@angular/core";
import { Items } from '../../models/global.models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-items-card',
    templateUrl: 'items-card.component.html',
    styleUrls: ['items-card.component.scss']
})
export class ItemsCardComponent {
    @Input('header') public header: string;
    @Input('items') public items: Items[];
    @Input('path') private _path: string;
    @Input('isClickOnHeader') private _isClickOnHeader: boolean = false
    public oneItem: string;
    constructor(private _router: Router, private _matDialog: MatDialog, private _activatedRoute: ActivatedRoute) {
        this.oneItem = this._activatedRoute.snapshot.data.label;
    }
    public goToHeader() {        
        if (this._isClickOnHeader)
            this._router.navigate([`${this._path}`])
    }
    public openModal(item: Items) {
        if (item.path) {
            this._router.navigate([`${this._path}/${item.path}`]);
            // window.open(`http://localhost:4200/fixed-assets/${item.path}`, '_blank')
        } else {
            if (item && item.modalName) {
                let label: string = item.longTitle ? item.longTitle : item.label;
                let param1 = {
                    width: '80vw',
                    minHeight: '55vh',
                    maxHeight: '85vh',
                    data: { label: label, type: item.type },
                    autoFocus: false

                }
                let param2 = {
                    width: '700px',
                    data: { label: label, type: item.type },
                    autoFocus: false
                }
                let modalParamms = item.isSmallModal ? param2 : param1
                this._matDialog.open(item.modalName, modalParamms)
            }
        }
    }
    public back() {
        this._router.navigate([''])
    }
}
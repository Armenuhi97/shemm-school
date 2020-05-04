import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Items } from '../../../models/global.models';
import { Title } from '@angular/platform-browser';
import { OperationImportedFromFile, OperationImportedFromBankModal, EnterOperationFromFileModal } from './modals';

@Component({
    selector: 'main-bank-view',
    templateUrl: 'main-bank.view.html',
    styleUrls: ['main-bank.view.scss']
})
export class MainBankView {
    public header: string;

    private _bankItems: Items[] = [
        { label: 'Հաշվարկային հաշիվներ բանկում', path: 'bank-account' },
        { label: 'Համալրում', path: 'replenishment' },
        { label: 'Վճարման հանձնարարագիր', path: 'payment-order' },
        { label: 'Ֆայլից ներմուծված գործառնություններ', longTitle: 'Ինտերնետ բանկից ներմուծված գործառնություններ', modalName: OperationImportedFromFile, type: 0 },
        { label: 'Ներմուծել գործառնությունները ֆայլից', modalName: EnterOperationFromFileModal, isSmallModal: true, type: 0 },
        { label: 'Ներմուծել արտարժույթի փոխարժեքներ', longTitle: 'Ներմուծել արտարժույթի փոխարժեքները ԿԲ կայքից', modalName: OperationImportedFromBankModal, type: 0 },
        { label: 'Գործառնությունների նշանակություն', path: 'operation-significance' }

    ]

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _title: Title) {
        this.header = this._activatedRoute.data['_value'].title;
        this._title.setTitle(this.header)
    }

    ngOnInit() { }

    get bankItems(): Items[] {
        return this._bankItems;
    }

    ngOnDestroy() { }
}

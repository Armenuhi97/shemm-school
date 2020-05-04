import { Component, Inject } from "@angular/core";

@Component({
    selector: 'accounting-invoice-view',
    templateUrl: 'accounting-invoice.view.html',
    styleUrls: ['accounting-invoice.view.scss']
})
export class AccountingInvoiceView {
    public mainUrl:string;
    public getOneUrl:string
    constructor( @Inject('URL_NAMES') private _urls){}
    ngOnInit(){
        this.mainUrl=this._urls.accountingInvoiceMainUrl;
        this.getOneUrl=this._urls.accountingInvoiceGetOneUrl
    }
 }
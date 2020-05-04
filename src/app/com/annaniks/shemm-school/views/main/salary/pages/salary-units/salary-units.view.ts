import { Component, Inject } from "@angular/core";

@Component({
    selector: 'salary-units-view',
    templateUrl: 'salary-units.view.html',
    styleUrls: ['salary-units.view.scss']
})
export class SalaryUnitsView {
    public mainUrl:string;
    public getOneUrl:string
    constructor( @Inject('URL_NAMES') private _urls){}
    ngOnInit(){
        this.mainUrl=this._urls.subdivisionMainUrl;
        this.getOneUrl=this._urls.subdivisionGetOneUrl
    }
}
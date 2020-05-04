import { Component, Inject } from "@angular/core";

@Component({
    selector: 'profession-view',
    templateUrl: 'profession.view.html',
    styleUrls: ['profession.view.scss']
})
export class ProfessionView { 
    public mainUrl:string;
    public getOneUrl:string
    constructor( @Inject('URL_NAMES') private _urls){}
    ngOnInit(){
        this.mainUrl=this._urls.professionMainUrl;
        this.getOneUrl=this._urls.professionGetOneUrl
    }
}
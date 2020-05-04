import { Component, Inject } from "@angular/core";

@Component({
    selector: 'position-view',
    templateUrl: 'position.view.html',
    styleUrls: ['position.view.scss']
})
export class PositionView { 
    public mainUrl:string;
    public getOneUrl:string
    constructor( @Inject('URL_NAMES') private _urls){}
    ngOnInit(){
        this.mainUrl=this._urls.positionMainUrl;
        this.getOneUrl=this._urls.positionGetOneUrl
    }
}
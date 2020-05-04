import { Component, Inject } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AddUnitModal } from '../../modals';
import { Title } from '@angular/platform-browser';
import { FixedAssetsService } from '../../fixed-assets.service';
import { ServerResponse } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Component({
    selector: 'unit-view',
    templateUrl: 'unit.view.html',
    styleUrls: ['unit.view.scss']
})
export class UnitView {
    public mainUrl:string;
    public getOneUrl:string
    constructor( @Inject('URL_NAMES') private _urls){}
    ngOnInit(){
        this.mainUrl=this._urls.subdivisionOfFixedAssetsMainUrl;
        this.getOneUrl=this._urls.subdivisionOfFixedAssetsGetOneUrl
    }
}
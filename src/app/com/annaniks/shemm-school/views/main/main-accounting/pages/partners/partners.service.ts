import { Injectable } from "@angular/core";
import { MainService } from '../../../main.service';

@Injectable()
export class PartnerService {
    constructor(private _mainService: MainService) { }
    public addPartner(body) {
        return this._mainService.addByUrl('partner',
            body)
    }
    public updatePartner(id: number, body) {
        return this._mainService.updateByUrl('partner', id,
            body)
    }
}
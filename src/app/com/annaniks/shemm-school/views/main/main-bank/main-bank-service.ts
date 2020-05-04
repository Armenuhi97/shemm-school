import { Injectable } from '@angular/core';
import { MainService } from '../main.service';

@Injectable()
export class MainBankService {
    constructor(private _mainService: MainService) { }
    public getGroups(id: number,date:string) {
        return this._mainService.getByUrlWithoutLimit(`operations-partners/${id}/${date}`)
    }
}
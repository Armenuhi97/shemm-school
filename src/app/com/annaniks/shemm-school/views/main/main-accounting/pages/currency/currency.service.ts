import { Injectable } from "@angular/core";
import { MainService } from '../../../main.service';

@Injectable()
export class CurrencyService {
    constructor(private _mainService: MainService) { }
    /**
     * 
     * @param currency 
     * @param name 
     */
    public addCurrency(body:{currency: string, name: string}) {
        return this._mainService.addByUrl('currency', body)
    }
    /**
     * 
     * @param id 
     * @param currency 
     * @param name 
     */
    public updateCurrency(id: number, body:{currency: string, name: string}) {
        return this._mainService.updateByUrl('currency', id, body)
    }
}
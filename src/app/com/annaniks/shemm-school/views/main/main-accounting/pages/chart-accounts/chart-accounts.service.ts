import { Injectable } from "@angular/core";
import { MainService } from '../../../main.service';

@Injectable()
export class ChartAccountsService{
    constructor(private _mainService:MainService){}
    public getAccounts(limit,offset){
        return this._mainService.getByUrl('account-plans',limit,offset)
    }
    public getAccountsCount(){
        return this._mainService.getCount('account-plans')
    }
    public deleteAccount(id:number){
        return this._mainService.deleteByUrl('account-plan',id)
    }
}
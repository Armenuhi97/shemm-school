import { Injectable } from '@angular/core';
import { MainService } from '../main.service';

@Injectable()
export class WarehouseService {
    constructor(private _mainService: MainService) { }
    public getMaterialValueByWarehouse(id: number,typeId:number,date:string) {
        return this._mainService.getByUrlWithoutLimit(`warehouse-exit-material-value/${id}/${typeId}/${date}`)
    }
}
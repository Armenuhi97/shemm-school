import { Injectable } from '@angular/core';
import { MainService } from '../../../main.service';

@Injectable()
export class WarehousesService {
    constructor(private _mainService: MainService) { }

    public getWarehouses(limit: number, offset: number) {
        return this._mainService.getByUrl('warehouses', limit, offset)
    }
    public getWarehousesCount() {
        return this._mainService.getCount('warehouses')
    }
    public deleteWarehouse(id: number) {
        return this._mainService.deleteByUrl('warehouse', id)
    }
}
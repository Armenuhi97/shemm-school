import { Injectable } from '@angular/core';
import { MainService } from '../../../main.service';

@Injectable()
export class UnitOfMeasurementService {
    constructor(private _mainService: MainService){}

    public getMeasurement(limit,offset){
        return this._mainService.getByUrl('measurement-units',limit,offset)
    }
    public getMeasurementsCount(){
        return this._mainService.getCount('measurement-units')
    }
    public deleteMeasurement(id:number){
        return this._mainService.deleteByUrl('measurement-unit',id)
    }
}

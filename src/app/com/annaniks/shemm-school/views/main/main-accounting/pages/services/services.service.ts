import { Injectable } from '@angular/core';
import { MainService } from '../../../main.service';

@Injectable()
export class ServicesService {
    constructor(
        private _mainService: MainService
    ) { }

    public getServices(limit, offset) {
        return this._mainService.getByUrl('services', limit, offset)
    }
    public getServicesCount() {
        return this._mainService.getCount('services')
    }
    public deleteService(id: number) {
        return this._mainService.deleteByUrl('service', id)
    }


    public getMeasurementUnit(limit, offset) {
        return this._mainService.getByUrl('measurement-units', limit, offset)
    }
    public getMeasurementsUnitCount() {
        return this._mainService.getCount('measurement-units')
    }
    public deleteMeasurementUnit(id: number) {
        return this._mainService.deleteByUrl('measurement-unit', id)
    }


}
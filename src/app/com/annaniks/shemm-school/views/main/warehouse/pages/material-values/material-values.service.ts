import { Injectable } from '@angular/core';
import { MainService } from '../../../main.service';
import { Observable } from 'rxjs';
import { DataCount, ServerResponse } from 'src/app/com/annaniks/shemm-school/models/global.models';

@Injectable()
export class MaterialValuesService {

    constructor(private _mainService: MainService) { }

    public getMaterialValues(limit: number, offset: number) {
        return this._mainService.getByUrl('material-values', limit, offset)
    }
    public getMaterialValuesCount() {
        return this._mainService.getCount('material-values')
    }
    public deleteMaterialValue(id: number) {
        return this._mainService.deleteByUrl('material-value', id)
    }

    //   Measurement  chapman miavor
    public getMeasurement(limit, offset) {
        return this._mainService.getByUrl('measurement-units', limit, offset)
    }
    public getMeasurementsCount() {
        return this._mainService.getCount('measurement-units')
    }
    public deleteMeasurement(id: number) {
        return this._mainService.deleteByUrl('measurement-unit', id)
    }

    // material-value-groups

    public getMaterialValueGroup(limit, offset) {
        return this._mainService.getByUrl('material-value-groups', limit, offset)
    }
    public getMaterialValueGroupsCount(): Observable<ServerResponse<DataCount>> {
        return this._mainService.getCount('material-value-groups')
    }
    public deleteMaterialValueGroup(id: number) {
        return this._mainService.deleteByUrl('material-value-group', id)
    }


    //   /account-plans/:limit/:offset

    public getAccountPlans(limit, offset) {
        return this._mainService.getByUrl('account-plans', limit, offset)
    }

    public getAccountPlansCount() {
        return this._mainService.getCount('account-plans')
    }


}
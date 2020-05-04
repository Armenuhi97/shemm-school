import { Injectable } from "@angular/core";
import { MainService } from '../../../main.service';

@Injectable()
export class EmployeesService {
    constructor(private _mainService: MainService) { }
    public addEmployees(body) {
        return this._mainService.addByUrl('employee', body)
    }
    public updateEmployee(id:number,body) {
        return this._mainService.updateByUrl('employee',id, body)
    }
    public generateTableCounter(){
        return this._mainService.generateField('employee','tabel_counter')
    }
    public filterAddition(id:number,key:string,date,endDate){
        return this._mainService.getByUrlWithoutLimit(`employee-${key}/${id}/${date}/${endDate}`)
    }
}
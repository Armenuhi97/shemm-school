import { Injectable, Inject } from "@angular/core";
import { MainService } from '../main.service';

@Injectable()
export class SalaryService {
    constructor(private _mainService: MainService, @Inject('URL_NAMES') private _urls) { }
    public getEmployeesSalary(date) {
        return this._mainService.getByUrlWithoutLimit(`${this._urls.employeeSalaryUrl}/${date}`)
    }
    public sendSalary(body) {
        return this._mainService.addByUrl('employee-operations', body)
    }
    public sendFinalSalary(body) {
        return this._mainService.addByUrl('salary', body)
    }
    public getLastYearSalaryByMonths(employeeId: number, startDate: string) {
        return this._mainService.getByUrlWithoutLimit(`salariesByEmployee/${employeeId}/${startDate}`)
    }
    public generateVacationDocumentNumber() {
        return this._mainService.generateField('vacation', 'document_number')
    }
    public generateBenefitDocumentNumber() {
        return this._mainService.generateField('benefit', 'document_number')
    }
    public checkIsHasSalaryByDate(date:string){
        return this._mainService.getByUrlWithoutLimit(`group-salaries-by-date/${date}`)
    }
}
import { NgModule } from "@angular/core";
import { SalaryEmployeeView } from './salary-employee.view';
import { SalaryEmployeeRoutingModule } from './salary-employee.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { EmployeesModule } from '../../../fixed-assets/pages/employees/employees.module';

@NgModule({
    declarations: [SalaryEmployeeView],
    imports: [SalaryEmployeeRoutingModule, SharedModule,EmployeesModule]
})
export class SalaryEmployeeModule { }
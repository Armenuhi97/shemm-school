import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SalaryEmployeeView } from './salary-employee.view';
let salaryEmployeeRoutes: Routes = [{ path: '', component: SalaryEmployeeView }]
@NgModule({
    imports: [RouterModule.forChild(salaryEmployeeRoutes)],
    exports: [RouterModule]
})
export class SalaryEmployeeRoutingModule { }
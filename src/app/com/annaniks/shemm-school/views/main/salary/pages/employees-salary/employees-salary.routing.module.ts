import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmployeesSalararyView } from './employees-salary.view';
let empoyeesSalaryRoutes: Routes = [{ path: '', component: EmployeesSalararyView }]

@NgModule({
    imports: [RouterModule.forChild(empoyeesSalaryRoutes)],
    exports: [RouterModule]
})

export class EmployeesSalaryRoutingModule { }
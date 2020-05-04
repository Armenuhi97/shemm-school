import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EmployeeView } from './employees.view';
let employeesRoutes: Routes = [{ path: '', component: EmployeeView }]
@NgModule({
    imports: [RouterModule.forChild(employeesRoutes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule {

}
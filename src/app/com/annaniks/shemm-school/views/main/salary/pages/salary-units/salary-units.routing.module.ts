import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SalaryUnitsView } from './salary-units.view';
let salaryUnitsRoutes: Routes = [{ path: '', component: SalaryUnitsView }]
@NgModule({
    imports: [RouterModule.forChild(salaryUnitsRoutes)],
    exports: [RouterModule]
})
export class SalaryUnitsRoutingModule { }
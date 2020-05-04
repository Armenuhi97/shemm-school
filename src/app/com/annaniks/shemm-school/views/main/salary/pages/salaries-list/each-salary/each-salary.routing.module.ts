import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EachSalaryView } from './each-salary.view';
let eachSalaryRoutes: Routes = [{ path: '', component: EachSalaryView }]
@NgModule({
    imports: [RouterModule.forChild(eachSalaryRoutes)],
    exports: [RouterModule]
})
export class EachSalaryRoutingModule {

}
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SalariesListView } from './salaries-list.view';
let salariesListRoutes: Routes = [{ path: '', component: SalariesListView }]
@NgModule({
    imports: [RouterModule.forChild(salariesListRoutes)],
    exports: [RouterModule]
})
export class SalariesListRoutingModule { }
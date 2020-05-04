import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ChartAccountsView } from './chart-accounts.view';
let chartAccountsRoutes: Routes = [{ path: '', component: ChartAccountsView }]
@NgModule({
    imports: [RouterModule.forChild(chartAccountsRoutes)],
    exports: [RouterModule]
})
export class ChartAccountsRoutingModule { }
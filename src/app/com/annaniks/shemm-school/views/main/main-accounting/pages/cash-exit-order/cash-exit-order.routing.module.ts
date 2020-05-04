import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CashExitOrderView } from './cash-exit-order.view';
let cashExitOrderRoutes: Routes = [{ path: '', component: CashExitOrderView }]
@NgModule({
    imports: [RouterModule.forChild(cashExitOrderRoutes)],
    exports: [RouterModule]
})
export class CashExitOrderRoutingModule { }
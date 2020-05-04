import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CashEntryOrderView } from './cash-entry-order.view';
let cashEntryOrderRoutes: Routes = [{ path: '', component: CashEntryOrderView }]
@NgModule({
    imports: [RouterModule.forChild(cashEntryOrderRoutes)],
    exports: [RouterModule]
})
export class CashEntryOrderRoutingModule { }
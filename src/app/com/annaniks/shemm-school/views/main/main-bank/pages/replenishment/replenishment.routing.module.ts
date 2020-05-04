import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ReplenishmentView } from './replenishment.view';
let replenishmentRoutes: Routes = [{ path: '', component: ReplenishmentView }]
@NgModule({
    imports: [RouterModule.forChild(replenishmentRoutes)],
    exports: [RouterModule]
})
export class ReplenishmentRoutingModule { }
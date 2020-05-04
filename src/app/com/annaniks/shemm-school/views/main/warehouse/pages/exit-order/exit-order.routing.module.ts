import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ExitOrderView } from './exit-order.view';
let exitOrderRoutes: Routes = [{ path: '', component: ExitOrderView }]
@NgModule({
    imports: [RouterModule.forChild(exitOrderRoutes)],
    exports: [RouterModule]
})
export class ExitOrderRoutingModule { }
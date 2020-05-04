import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { FinalCalculationsView } from './final-calculations.view';
let finalCalculationsRoutes: Routes = [{ path: '', component: FinalCalculationsView }]
@NgModule({
    imports: [RouterModule.forChild(finalCalculationsRoutes)],
    exports: [RouterModule]
})
export class FinalCalcalutaionsRoutingModule { }
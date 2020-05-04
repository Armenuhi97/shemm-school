import { Routes, RouterModule } from '@angular/router';
import { AnalyticalGroupView } from './analytical-group.view';
import { NgModule } from '@angular/core';
let analyticalGroupRoutes: Routes = [{ path: '', component: AnalyticalGroupView }]
@NgModule({
    imports: [RouterModule.forChild(analyticalGroupRoutes)],
    exports: [RouterModule]
})
export class AnalyticalGroupRoutingModule {

}
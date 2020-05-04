import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PositionView } from './position.view';
let postionRoutes: Routes = [{ path: '', component: PositionView }]
@NgModule({
    imports: [RouterModule.forChild(postionRoutes)],
    exports: [RouterModule]
})
export class PositionRoutingModule { }
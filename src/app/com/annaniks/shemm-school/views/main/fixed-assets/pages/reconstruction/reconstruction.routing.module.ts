import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ReconstructionView } from './reconstruction.view';
let reconstructionRoutes: Routes = [{ path: '', component: ReconstructionView }]
@NgModule({
    imports: [RouterModule.forChild(reconstructionRoutes)],
    exports: [RouterModule]
})
export class ReconstructionRoutingModule { }
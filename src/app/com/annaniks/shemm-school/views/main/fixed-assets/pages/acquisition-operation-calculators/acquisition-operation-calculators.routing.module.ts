import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AcquisitionOperationOfFixedAssetsView } from './acquisition-operation-calculators.view';
let routes: Routes = [{ path: '', component: AcquisitionOperationOfFixedAssetsView }]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AcquisitionOperationOfFixedAssetsRoutingModule { }
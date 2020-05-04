import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { MaterialValuesShiftView } from './material-values-shift.view';
let materialValuesShiftRoutes: Routes = [{ path: '', component: MaterialValuesShiftView }]
@NgModule({
    imports: [RouterModule.forChild(materialValuesShiftRoutes)],
    exports: [RouterModule]
})
export class MaterialValuesShiftRoutingModule { }
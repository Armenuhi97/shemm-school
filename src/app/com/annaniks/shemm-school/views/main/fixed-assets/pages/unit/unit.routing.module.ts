import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { UnitView } from './unit.view';
let unitRoutes: Routes = [{ path: '', component: UnitView }]
@NgModule({
    imports: [RouterModule.forChild(unitRoutes)],
    exports: [RouterModule]
})
export class UnitRoutingModule { }
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ProfessionView } from './profession.view';
let professionRoutes: Routes = [{ path: '', component: ProfessionView }]
@NgModule({
    imports: [RouterModule.forChild(professionRoutes)],
    exports: [RouterModule]
})
export class ProfessionRoutingModule { }
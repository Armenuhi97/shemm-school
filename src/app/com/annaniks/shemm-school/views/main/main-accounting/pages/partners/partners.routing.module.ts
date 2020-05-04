import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PartnersView } from './partners.view';
let partnersRoutes: Routes = [{ path: '', component: PartnersView }]
@NgModule({
    imports: [RouterModule.forChild(partnersRoutes)],
    exports: [RouterModule]
})
export class PartnersRoutingModule { }
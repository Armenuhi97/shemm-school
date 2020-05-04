import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ServicesView } from './services.view';
let servicesRoutes: Routes = [{ path: '', component: ServicesView }]
@NgModule({
    imports: [RouterModule.forChild(servicesRoutes)],
    exports: [RouterModule]
})
export class ServicesRoutingModule { }
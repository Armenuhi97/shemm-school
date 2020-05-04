import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { TypesView } from './types.view';
let typesRoutes: Routes = [{ path: '', component: TypesView }]
@NgModule({
    imports: [RouterModule.forChild(typesRoutes)],
    exports: [RouterModule]
})
export class TypesRoutingModule {

}
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AdditionView } from './addition.view';
let additionRoutes: Routes = [{ path: '', component: AdditionView }]
@NgModule({
    imports: [RouterModule.forChild(additionRoutes)],
    exports: [RouterModule]
})
export class AdditionRoutingModule { }
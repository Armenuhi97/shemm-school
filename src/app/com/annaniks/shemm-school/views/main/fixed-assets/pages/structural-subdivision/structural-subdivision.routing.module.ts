import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { StructuralSubdivisionView } from './structural-subdivision.view';
let structuralSubdivisionRoutes: Routes = [{ path: '', component: StructuralSubdivisionView }]
@NgModule({
    imports: [RouterModule.forChild(structuralSubdivisionRoutes)],
    exports: [RouterModule]
})
export class StructuralSubdivisionRoutingModule { }
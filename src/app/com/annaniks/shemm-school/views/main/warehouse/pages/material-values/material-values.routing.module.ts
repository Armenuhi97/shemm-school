import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { MaterialValuesView } from './material-values.view';
let materialValuesRoutes:Routes=[{path:'',component:MaterialValuesView}]
@NgModule({
    imports:[RouterModule.forChild(materialValuesRoutes)],
    exports:[RouterModule]
})
export class MaterialValuesRoutingModule{}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { SubsectionView } from './subsection.view';
let subsectionRoutes: Routes = [{ path: '', component: SubsectionView }]
@NgModule({
    imports: [RouterModule.forChild(subsectionRoutes)],
    exports: [RouterModule]
})
export class SubsectionRoutingModule {

}
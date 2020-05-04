
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { MainFixedAssetsComponent } from './main-fixed-assets.component';

const mainfixedAssetsRoutes: Routes = [
    { path: '', component: MainFixedAssetsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(mainfixedAssetsRoutes)],
    exports: [RouterModule]
})


export class MainFixedAssetsRoutingModule {

}


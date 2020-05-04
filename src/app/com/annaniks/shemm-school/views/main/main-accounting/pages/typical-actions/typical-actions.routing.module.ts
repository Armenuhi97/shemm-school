import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { TypicalActionView } from './typical-actions.view';
let typicalActionRoutes: Routes = [{ path: '', component: TypicalActionView }]
@NgModule({
    imports: [RouterModule.forChild(typicalActionRoutes)],
    exports: [RouterModule]
})
export class TypicalActionRoutingModule { }
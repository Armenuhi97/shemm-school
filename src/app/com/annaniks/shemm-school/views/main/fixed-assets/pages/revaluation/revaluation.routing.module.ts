import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { RevaluationView } from './revaluation.view';
let revaluationRoutes: Routes = [{ path: '', component: RevaluationView }]
@NgModule({
    imports: [RouterModule.forChild(revaluationRoutes)],
    exports: [RouterModule]
})
export class RevaluationRoutingModule { }
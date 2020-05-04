import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { OperationSignificanceView } from './operation-significance.view';

const operationSignificanceRoutes: Routes = [
  { path: '', component: OperationSignificanceView }
]

@NgModule({
    imports: [RouterModule.forChild(operationSignificanceRoutes)],
    exports: [RouterModule]
})
export class OperationSignificanceRoutingModule { }

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ActPuttingIntoOperationView } from './act-putting-into-operation.view';
let actPuttingIntoOperationRoutes: Routes = [{ path: '', component: ActPuttingIntoOperationView }]
@NgModule({
    imports: [RouterModule.forChild(actPuttingIntoOperationRoutes)],
    exports: [RouterModule]
})
export class ActPuttingIntoOperationRoutingModule { }
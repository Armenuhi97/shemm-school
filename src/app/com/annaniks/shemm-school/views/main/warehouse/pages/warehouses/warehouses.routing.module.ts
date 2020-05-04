import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { WarehousesView } from './warehouses.view';
let warehouseRoutes: Routes = [{ path: '', component: WarehousesView }]
@NgModule({
    imports: [RouterModule.forChild(warehouseRoutes)],
    exports: [RouterModule]
})
export class WarehousesRoutingModule { }
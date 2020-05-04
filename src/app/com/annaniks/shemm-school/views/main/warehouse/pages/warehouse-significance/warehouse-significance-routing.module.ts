import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { WarehouseSignificanceView } from './warehouse-significance.view';

const warehouseSignificanceRoutes: Routes = [
  { path: '', component: WarehouseSignificanceView }
];

@NgModule({
    imports: [RouterModule.forChild(warehouseSignificanceRoutes)],
    exports: [RouterModule]
})
export class WarehouseSignificanceRoutingModule { }

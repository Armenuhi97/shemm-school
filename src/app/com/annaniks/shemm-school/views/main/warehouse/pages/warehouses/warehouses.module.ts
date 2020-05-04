import { NgModule } from "@angular/core";
import { WarehousesView } from './warehouses.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { WarehousesRoutingModule } from './warehouses.routing.module';
import { AddWarehouseModal } from '../../modals';
import { WarehousesService } from './warehouses.service';

@NgModule({
    declarations: [WarehousesView, AddWarehouseModal],
    imports: [WarehousesRoutingModule, SharedModule],
    providers: [WarehousesService],
    entryComponents: [AddWarehouseModal]
})
export class WarehousesModule { }
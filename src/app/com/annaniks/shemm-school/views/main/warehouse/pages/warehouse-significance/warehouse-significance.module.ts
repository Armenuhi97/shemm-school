import { NgModule } from "@angular/core";
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { WarehouseSignificanceView } from './warehouse-significance.view';
import { WarehouseSignificanceRoutingModule } from './warehouse-significance-routing.module';

@NgModule({
    declarations: [WarehouseSignificanceView],
    imports: [WarehouseSignificanceRoutingModule, SharedModule]
})
export class WarehouseSignificanceModule { }

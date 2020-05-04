import { NgModule } from "@angular/core";
import { ExitOrderView } from './exit-order.view';
import { ExitOrderRoutingModule } from './exit-order.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ExitOrderService } from './exit-order.service';

@NgModule({
    declarations: [ExitOrderView],
    imports: [ExitOrderRoutingModule, SharedModule],
    entryComponents:[],
    providers:[ExitOrderService]
})
export class ExitOrderModule { }
import { NgModule } from "@angular/core";
import { CashExitOrderView } from './cash-exit-order.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { CashExitOrderRoutingModule } from './cash-exit-order.routing.module';

@NgModule({
    declarations: [CashExitOrderView],
    imports: [SharedModule, CashExitOrderRoutingModule]
})
export class CashExitOrderModule { }
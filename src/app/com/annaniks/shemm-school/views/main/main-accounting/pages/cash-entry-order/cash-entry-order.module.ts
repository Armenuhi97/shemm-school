import { NgModule } from "@angular/core";
import { CashEntryOrderView } from './cash-entry-order.view';
import { CashEntryOrderRoutingModule } from './cash-entry-order.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [CashEntryOrderView],
    imports: [CashEntryOrderRoutingModule, SharedModule]
})
export class CashEntryOrderModule { }
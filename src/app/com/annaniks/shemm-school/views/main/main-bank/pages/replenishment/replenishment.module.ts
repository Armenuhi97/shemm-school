import { NgModule } from "@angular/core";
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ReplenishmentView } from './replenishment.view';
import { ReplenishmentRoutingModule } from './replenishment.routing.module';
import { ReplenishmentModal } from '../../modals';

@NgModule({
    declarations: [ReplenishmentView, ReplenishmentModal],
    entryComponents: [ReplenishmentModal],
    imports: [SharedModule, ReplenishmentRoutingModule]
})
export class ReplenishmentModule { }
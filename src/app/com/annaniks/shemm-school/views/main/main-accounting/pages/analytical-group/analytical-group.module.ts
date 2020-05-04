import { NgModule } from "@angular/core";
import { AnalyticalGroupView } from './analytical-group.view';
import { AnalyticalGroupRoutingModule } from './analytical-group.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddAnalyticGroupModal } from '../../modals';

@NgModule({
    declarations: [AnalyticalGroupView,AddAnalyticGroupModal],
    entryComponents:[AddAnalyticGroupModal],
    imports: [AnalyticalGroupRoutingModule, SharedModule]
})
export class AnalyticalGroupModule {

}
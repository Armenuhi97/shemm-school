import { NgModule } from "@angular/core";
import { TypicalActionView } from './typical-actions.view';
import { TypicalActionRoutingModule } from './typical-actions.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddTypicalActionsModal } from '../../modals';

@NgModule({
    declarations: [TypicalActionView,AddTypicalActionsModal],
    imports: [TypicalActionRoutingModule, SharedModule],
    entryComponents:[AddTypicalActionsModal]
})
export class TypicalActionsModule { }
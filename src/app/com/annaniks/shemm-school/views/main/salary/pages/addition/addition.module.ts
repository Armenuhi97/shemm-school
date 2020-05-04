import { NgModule } from "@angular/core";
import { AdditionView } from './addition.view';
import { AdditionRoutingModule } from './addition.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddAdditionModal } from '../../modals';

@NgModule({
    declarations: [AdditionView, AddAdditionModal],
    imports: [AdditionRoutingModule, SharedModule],
    entryComponents: [AddAdditionModal]
})
export class AdditionModule { }
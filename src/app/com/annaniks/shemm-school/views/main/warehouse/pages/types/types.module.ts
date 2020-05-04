import { NgModule } from "@angular/core";
import { TypesView } from './types.view';
import { TypesRoutingModule } from './types.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddTypesModal } from '../../modals';

@NgModule({
    declarations: [TypesView, AddTypesModal],
    entryComponents: [AddTypesModal],
    imports: [TypesRoutingModule, SharedModule]
})
export class TypesModule { }
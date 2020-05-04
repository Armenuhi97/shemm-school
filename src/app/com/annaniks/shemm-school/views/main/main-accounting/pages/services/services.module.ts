import { NgModule } from "@angular/core";
import { ServicesView } from './services.view';
import { ServicesRoutingModule } from './services.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AddServiceModal } from '../../modals';
import { ServicesService } from './services.service';

@NgModule({
    declarations: [ServicesView, AddServiceModal],
    entryComponents: [AddServiceModal],
    imports: [ServicesRoutingModule, SharedModule],
    providers: [ServicesService]
})
export class ServicesModule { }
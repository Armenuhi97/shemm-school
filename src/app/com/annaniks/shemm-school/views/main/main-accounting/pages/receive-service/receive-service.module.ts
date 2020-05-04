import { NgModule } from "@angular/core";
import { ReceiveServiceView } from './receive-service.view';
import { ReceiveServiceRoutingModule } from './receive-service.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ReceiveServiceView],
    imports: [ReceiveServiceRoutingModule, SharedModule]
})
export class ReceiveServiceModule { }
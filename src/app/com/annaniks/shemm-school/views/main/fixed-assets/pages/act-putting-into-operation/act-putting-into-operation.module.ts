import { NgModule } from "@angular/core";
import { ActPuttingIntoOperationView } from './act-putting-into-operation.view';
import { ActPuttingIntoOperationRoutingModule } from './act-putting-into-operation.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [ActPuttingIntoOperationView],
    imports: [ActPuttingIntoOperationRoutingModule, SharedModule]
})
export class ActPuttingIntoOperationModule { }
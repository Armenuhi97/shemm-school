import { NgModule } from "@angular/core";

import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { OperationSignificanceRoutingModule } from './operation-significance-routing.module';
import { OperationSignificanceView } from './operation-significance.view';

@NgModule({
    declarations: [OperationSignificanceView],
    imports: [SharedModule, OperationSignificanceRoutingModule]
})
export class OperationSignificanceModule { }

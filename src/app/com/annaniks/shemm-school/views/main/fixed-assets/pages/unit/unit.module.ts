import { NgModule } from "@angular/core";
import { UnitView } from './unit.view';
import { UnitRoutingModule } from './unit.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [UnitView],
    imports: [UnitRoutingModule, SharedModule]
})
export class UnitModule { }
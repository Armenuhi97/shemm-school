import { NgModule } from "@angular/core";
import { FinalCalculationsView } from './final-calculations.view';
import { FinalCalcalutaionsRoutingModule } from './final-calculations.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [FinalCalculationsView],
    imports: [FinalCalcalutaionsRoutingModule, SharedModule]
})
export class FinalCalculationsModule { }
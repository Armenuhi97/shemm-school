import { NgModule } from "@angular/core";
import { CalculationVacationTimeView } from './calculation-vacation-time.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { CalculationVacationTimeRoutingModule } from './calculation-vacation-time.routing.module';

@NgModule({
    declarations: [CalculationVacationTimeView],
    imports: [SharedModule, CalculationVacationTimeRoutingModule]
})
export class CalculationVacationTimeModule { }
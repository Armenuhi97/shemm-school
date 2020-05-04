import { NgModule } from "@angular/core";
import { CalculationBenefitsView } from './calculation-benefits.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { CalculationBenefitsRoutingModule } from './calculation-benefits.routing.module';

@NgModule({
    declarations: [CalculationBenefitsView],
    imports: [SharedModule, CalculationBenefitsRoutingModule]
})
export class CalculationBenefitsModule { }
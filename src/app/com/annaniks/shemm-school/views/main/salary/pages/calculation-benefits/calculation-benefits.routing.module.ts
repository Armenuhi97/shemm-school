import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CalculationBenefitsView } from './calculation-benefits.view';
let calculationBenefitsRoutes: Routes = [{ path: '', component: CalculationBenefitsView }]
@NgModule({
    imports: [RouterModule.forChild(calculationBenefitsRoutes)],
    exports: [RouterModule]
})
export class CalculationBenefitsRoutingModule { }
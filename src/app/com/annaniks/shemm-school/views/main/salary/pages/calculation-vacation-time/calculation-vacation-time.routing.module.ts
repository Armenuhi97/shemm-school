import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CalculationVacationTimeView } from './calculation-vacation-time.view';
let calcuationVacationTimeRoutes: Routes = [{ path: '', component: CalculationVacationTimeView }]
@NgModule({
    imports: [RouterModule.forChild(calcuationVacationTimeRoutes)],
    exports: [RouterModule]
})
export class CalculationVacationTimeRoutingModule { }
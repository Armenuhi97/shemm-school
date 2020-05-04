import { NgModule } from "@angular/core";
import { SalaryUnitsView } from './salary-units.view';
import { SalaryUnitsRoutingModule } from './salary-units.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [SalaryUnitsView],
    imports: [SalaryUnitsRoutingModule, SharedModule],
})
export class SalaryUnitsModule { }
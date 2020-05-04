import { NgModule } from "@angular/core";
import { EachSalaryView } from './each-salary.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { EachSalaryRoutingModule } from './each-salary.routing.module';

@NgModule({
    declarations: [EachSalaryView],
    imports: [SharedModule, EachSalaryRoutingModule]
})
export class EachSalaryModule { }
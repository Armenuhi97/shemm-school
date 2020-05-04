import { NgModule } from "@angular/core";
import { SalariesListView } from './salaries-list.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { SalariesListRoutingModule } from './salaries-list.routing.module';

@NgModule({
    declarations: [SalariesListView],
    imports: [SharedModule, SalariesListRoutingModule]
})
export class SalariesListModule { }
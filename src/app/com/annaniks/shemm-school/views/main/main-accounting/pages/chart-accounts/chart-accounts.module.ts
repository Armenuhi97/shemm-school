import { NgModule } from "@angular/core";
import { ChartAccountsView } from './chart-accounts.view';
import { ChartAccountsRoutingModule } from './chart-accounts.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ChartAccountsService } from './chart-accounts.service';

@NgModule({
    declarations: [ChartAccountsView],
    imports: [ChartAccountsRoutingModule, SharedModule],
    providers:[ChartAccountsService]
})
export class ChartAccountsModule { }
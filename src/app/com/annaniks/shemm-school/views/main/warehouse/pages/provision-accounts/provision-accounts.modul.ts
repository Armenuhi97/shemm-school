import { NgModule } from "@angular/core";

import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { ProvisionAccountsRoutingModule } from './provision-accounts-routing.module';
import { ProvisionAccountsView } from './provision-accounts.view';

@NgModule({
    declarations: [ProvisionAccountsView],
    imports: [ProvisionAccountsRoutingModule, SharedModule]
})
export class ProvisionAccountsModule { }

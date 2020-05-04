import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { ProvisionAccountsView } from './provision-accounts.view';

let provisionAccountsRoutes: Routes = [{ path: '', component: ProvisionAccountsView }]
@NgModule({
    imports: [RouterModule.forChild(provisionAccountsRoutes)],
    exports: [RouterModule]
})
export class ProvisionAccountsRoutingModule { }

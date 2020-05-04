import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { EnterVaultView } from './enter-vault.view';
let enterValutRoutes: Routes = [{ path: '', component: EnterVaultView }]
@NgModule({
    imports: [RouterModule.forChild(enterValutRoutes)],
    exports: [RouterModule]
})
export class EnterValutRoutingModule { }
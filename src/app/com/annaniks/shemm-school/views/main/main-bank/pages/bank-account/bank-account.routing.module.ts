import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { BankAccountView } from './bank-account.view';
let bankAccountRoutes: Routes = [{ path: '', component: BankAccountView }]
@NgModule({
    imports: [RouterModule.forChild(bankAccountRoutes)],
    exports: [RouterModule]
})
export class BankAccountRoutingModule { }
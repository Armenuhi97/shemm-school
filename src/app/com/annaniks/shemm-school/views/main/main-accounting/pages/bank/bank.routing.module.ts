import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { BankView } from './bank.view';
let bankRoutes: Routes = [{ path: '', component: BankView }]
@NgModule({
    imports: [RouterModule.forChild(bankRoutes)],
    exports: [RouterModule]
})
export class BankRoutingModule { }
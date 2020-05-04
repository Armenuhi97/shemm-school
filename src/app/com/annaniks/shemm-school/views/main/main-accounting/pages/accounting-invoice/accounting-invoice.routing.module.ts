import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { AccountingInvoiceView } from './accounting-invoice.view';
let accountingInvoiceRoutes: Routes = [{ path: '', component: AccountingInvoiceView }]
@NgModule({
    imports: [RouterModule.forChild(accountingInvoiceRoutes)],
    exports: [RouterModule]
})
export class AccountingInvoiceRoutingModule { }
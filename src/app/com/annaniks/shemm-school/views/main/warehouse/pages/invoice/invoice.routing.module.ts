import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { InvoiceView } from './invoice.view';
let invoiceRoutes: Routes = [{ path: '', component: InvoiceView }]
@NgModule({
    imports: [RouterModule.forChild(invoiceRoutes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule { }
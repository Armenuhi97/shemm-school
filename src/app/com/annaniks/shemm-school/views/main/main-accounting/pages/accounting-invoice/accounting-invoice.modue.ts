import { NgModule } from "@angular/core";
import { AccountingInvoiceView } from './accounting-invoice.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { AccountingInvoiceRoutingModule } from './accounting-invoice.routing.module';
import { InvoiceModule } from '../../../warehouse/pages/invoice/invoice.module';

@NgModule({
    declarations: [AccountingInvoiceView],
    imports: [SharedModule, AccountingInvoiceRoutingModule,InvoiceModule]
})
export class AccountingInvoiceModule { }
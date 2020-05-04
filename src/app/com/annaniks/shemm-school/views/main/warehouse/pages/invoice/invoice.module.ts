import { NgModule } from "@angular/core";
import { InvoiceView } from './invoice.view';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [InvoiceView],
    imports: [InvoiceRoutingModule, SharedModule],
    exports:[InvoiceView]
})
export class InvoiceModule { }
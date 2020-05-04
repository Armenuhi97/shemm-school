import { NgModule } from "@angular/core";
import { PaymentFromCurrentAccountView } from './payment-from-current-account.view';
import { PaymentFromCurrentAccountRoutingModule } from './payment-from-current-account.routing.module';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';

@NgModule({
    declarations: [PaymentFromCurrentAccountView],
    imports: [PaymentFromCurrentAccountRoutingModule, SharedModule]
})
export class PaymentFromCurrentAccountModule { }
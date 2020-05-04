import { NgModule } from '@angular/core';
import { PaymentOrderRoutes } from './payment-order.routing';
import { PaymentOrderComponent } from './payment-order.view';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { PaymentOrderModal } from '../../modals';

@NgModule({
    declarations: [PaymentOrderComponent, PaymentOrderModal],
    imports: [PaymentOrderRoutes, SharedModule],
    entryComponents: [PaymentOrderModal]
})

export class PaymentOrderModule { } 
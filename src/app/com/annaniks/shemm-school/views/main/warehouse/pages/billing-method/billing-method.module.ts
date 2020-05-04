import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/com/annaniks/shemm-school/shared/shared.module';
import { BillingMethodComponent } from './billing-method.component';
import { BillingMethodRoutingModule } from './billing-method-routing.module';

@NgModule({
    declarations: [BillingMethodComponent],
    imports: [BillingMethodRoutingModule, SharedModule]
})

export class BillingMethodModule {

}
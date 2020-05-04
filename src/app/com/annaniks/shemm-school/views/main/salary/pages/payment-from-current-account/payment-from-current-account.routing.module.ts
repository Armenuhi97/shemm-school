import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { PaymentFromCurrentAccountView } from './payment-from-current-account.view';
let paymentFromCurrentAccountRoutes: Routes = [{ path: '', component: PaymentFromCurrentAccountView }]
@NgModule({
    imports: [RouterModule.forChild(paymentFromCurrentAccountRoutes)],
    exports: [RouterModule]
})
export class PaymentFromCurrentAccountRoutingModule { }
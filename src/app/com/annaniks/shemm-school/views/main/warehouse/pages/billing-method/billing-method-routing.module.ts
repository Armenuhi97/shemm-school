import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingMethodComponent } from './billing-method.component';

const billingMethodRoutiongRoutes: Routes= [
    { path: '', component: BillingMethodComponent }
]

@NgModule({
    imports: [RouterModule.forChild(billingMethodRoutiongRoutes)],
    exports: [RouterModule]
})

export class BillingMethodRoutingModule { }
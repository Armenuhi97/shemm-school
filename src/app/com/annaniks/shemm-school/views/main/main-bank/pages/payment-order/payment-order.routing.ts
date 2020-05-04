import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PaymentOrderComponent } from './payment-order.view';

const routes: Routes = [
  { path: '', component: PaymentOrderComponent },
];

export const PaymentOrderRoutes: ModuleWithProviders = RouterModule.forChild(routes);

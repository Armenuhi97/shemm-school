import { NgModule } from "@angular/core";
import { RouterModule, Routes, ActivatedRoute, Router } from '@angular/router';
import { MainBankView } from './main-bank.view';
let mainBankRoutes: Routes = [
  { path: '', component: MainBankView },
  { path: 'operation-significance', loadChildren: () => import('./pages/operation-significance/operation-significance.module').then(m => m.OperationSignificanceModule) },
  { path: 'replenishment', loadChildren: () => import('./pages/replenishment/replenishment.module').then(m => m.ReplenishmentModule) },
  { path: 'bank-account', loadChildren: () => import('./pages/bank-account/bank-account.module').then(m => m.BankAccountModule) },
  { path: 'payment-order', loadChildren: () => import('./pages/payment-order/payment-order.module').then(m => m.PaymentOrderModule) }
]

@NgModule({
  imports: [RouterModule.forChild(mainBankRoutes)],
  exports: [RouterModule]
})
export class MainBankRoutingModule { }

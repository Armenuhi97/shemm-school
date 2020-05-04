import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainAccountingComponent } from './main-accounting.component';
import { isPromise } from '@angular/compiler/src/util';

const mainAccountingRoutes: Routes = [
    { path: '', component: MainAccountingComponent },
    {
        path: 'unit-measurment',
        loadChildren: () => import('./pages/unit-of-measurement/unit-of-measurment.module').then(m => m.UnitOfMeasurmentModule)
    },
    { path: 'chart-of-accounts', loadChildren: () => import('./pages/chart-accounts/chart-accounts.module').then(m => m.ChartAccountsModule) },
    { path: 'partners', loadChildren: () => import('./pages/partners/partners.module').then(m => m.PartnersModule) },
    { path: 'cash-registers', loadChildren: () => import('./pages/cash-registers/cash-registers.modul').then(m => m.CashRegistersModule) },
    { path: 'services', loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesModule) },
    { path: 'price-of-services', loadChildren: () => import('./pages/price-of-services/price-of-services.module').then(m => m.PriceOfServicesModule) },
    { path: 'currency', loadChildren: () => import('./pages/currency/currency.module').then(m => m.CurrencyModule) },
    { path: 'bank', loadChildren: () => import('./pages/bank/bank.module').then(m => m.BankModule) },
    { path: 'typical-actions', loadChildren: () => import('./pages/typical-actions/typical-actions.module').then(m => m.TypicalActionsModule) },
    { path: 'formula', loadChildren: () => import('./pages/formula/formula.module').then(m => m.FormulaModule) },
    { path: 'analytical-group-1', loadChildren: () => import('./pages/analytical-group/analytical-group.module').then(m => m.AnalyticalGroupModule), data: { group: '1' } },
    { path: 'analytical-group-2', loadChildren: () => import('./pages/analytical-group/analytical-group.module').then(m => m.AnalyticalGroupModule), data: { group: '2' } },
    { path: 'receive-service', loadChildren: () => import('./pages/receive-service/receive-service.module').then(m => m.ReceiveServiceModule) },
    { path: 'cash-entry-order', loadChildren: () => import('./pages/cash-entry-order/cash-entry-order.module').then(m => m.CashEntryOrderModule) },
    { path: 'cash-exit-order', loadChildren: () => import('./pages/cash-exit-order/cash-exit-order.module').then(m => m.CashExitOrderModule) },
    { path: 'invoice', loadChildren: () => import('./pages/accounting-invoice/accounting-invoice.modue').then(m => m.AccountingInvoiceModule) }
]

@NgModule({
    imports: [RouterModule.forChild(mainAccountingRoutes)],
    exports: [RouterModule]
})

export class MainAccountingRoutingModule { }



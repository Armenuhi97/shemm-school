import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { WarehouseView } from './warehouse․view';

let warehouseRoutes: Routes = [
    { path: '', component: WarehouseView },
    { path: 'material-values', loadChildren: () => import('./pages/material-values/material-values.module').then(m => m.MaterialValuesModule) },
    { path: 'warehouses', loadChildren: () => import('./pages/warehouses/warehouses.module').then(m => m.WarehousesModule) },
    { path: 'subsection', loadChildren: () => import('./pages/subsection/subsection.module').then(m => m.SubsectionModule) },
    { path: 'material-value-group', loadChildren: () => import('./pages/group/group.module').then(m => m.GroupModule) },
    { path: 'warehouse-significance', loadChildren: () => import('./pages/warehouse-significance/warehouse-significance.module').then(m => m.WarehouseSignificanceModule) },
    { path: 'billing-method', loadChildren: () => import('./pages/billing-method/billing-method.module').then(m => m.BillingMethodModule) },
    { path: 'material-values', loadChildren: () => import('./pages/material-values/material-values.module').then(m => m.MaterialValuesModule) },
    { path: 'warehouses', loadChildren: () => import('./pages/warehouses/warehouses.module').then(m => m.WarehousesModule) },
    { path: 'subsection', loadChildren: () => import('./pages/subsection/subsection.module').then(m => m.SubsectionModule) },
    { path: 'types', loadChildren: () => import('./pages/types/types.module').then(m => m.TypesModule) },
    { path: 'classifier', loadChildren: () => import('./pages/classifier/classifier.module').then(m => m.ClassifierModule) },
    { path: 'entry-orders', loadChildren: () => import('./pages/enter-vault/enter-vault.module').then(m => m.EnterValutModule) },
    { path: 'exit-orders', loadChildren: () => import('./pages/exit-order/exit-order.module').then(m => m.ExitOrderModule) },
    { path: 'invoice', loadChildren: () => import('./pages/invoice/invoice.module').then(m => m.InvoiceModule) },
    { path: 'materail-values-shift', loadChildren: () => import('./pages/material-values-shift/material-values-shift.module').then(m => m.MaterialValuewShiftModule) },
    { path: 'provision-accounts', loadChildren: ()=> import('./pages/provision-accounts/provision-accounts.modul').then(m => m.ProvisionAccountsModule)}
]
@NgModule({
    imports: [RouterModule.forChild(warehouseRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class WarehouseRoutingModule { }

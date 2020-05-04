import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainView } from './main.view';

const mainRoutes: Routes = [
    {
        path: '', component: MainView, children: [
            { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
            { path: 'fixed-assets', loadChildren: () => import('./fixed-assets/fixed-assets.module').then(m => m.FixedAssetsModule), data: { title: 'Հիմնական միջոցներ' } },
            { path: 'warehouse', loadChildren: () => import('./warehouse/warehouse․module').then(m => m.WarehouseModule), data: { title: 'Պահեստ' } },
            { path: 'main-accounting', loadChildren: () => import('./main-accounting/main-accounting.module').then(m => m.MainAccountingModule), data: { title: 'Հաշվապահություն' } },
            { path: 'bank', loadChildren: () => import('./main-bank/main-bank.module').then(m => m.MainBankModule), data: { title: 'Բանկ' } },
            { path: 'salary', loadChildren: () => import('./salary/salary.module').then(m => m.SalaryModule), data: { title: 'Աշխատավարձ' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(mainRoutes)],
    exports: [RouterModule]
})

export class MainRoutingModule { }

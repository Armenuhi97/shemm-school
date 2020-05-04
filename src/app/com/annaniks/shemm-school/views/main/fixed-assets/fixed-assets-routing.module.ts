import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { FixedAssetsView } from './fixed-assets.view';
let fixedAssetsRoutes: Routes = [
    { path: '', component: FixedAssetsView },
    { path: 'structural-subdivision', loadChildren: () => import('./pages/structural-subdivision/structural-subdivision.module').then(m => m.StructuralSubdivisionModule) },
    { path: 'employess', loadChildren: () => import('./pages/employees/employees.module').then(m => m.EmployeesModule) },
    { path: 'units', loadChildren: () => import('./pages/unit/unit.module').then(m => m.UnitModule) },
    { path: 'main-fixed-assets', loadChildren: () => import('./pages/main-fixed-assets/main-fixed-assets.module').then(m => m.MainFixedAssetsModule) },
    { path: 'depreciation-calculation', loadChildren: () => import('./pages/depreciation-calculation/depreciation-calculation.module').then(m => m.DepreciationCalculationModule) },
    { path: 'by-tax-law', loadChildren: () => import('./pages/by-tax-law/by-tax-law.module').then(m => m.ByTaxLawModule) },
    { path: 'hmx-value-balance', loadChildren: () => import('./pages/hmx-value-balance/hmx-value-balance.module').then(m => m.HmxValueBalanceModule) },
    { path: 'hm-type', loadChildren: () => import('./pages/hm-type/hm-type.module').then(m => m.HmTypeModule) },
    { path: 'act-putting-into-operation', loadChildren: () => import('./pages/act-putting-into-operation/act-putting-into-operation.module').then(m => m.ActPuttingIntoOperationModule) },
    { path: 'reconstruction', loadChildren: () => import('./pages/reconstruction/reconstruction.module').then(m => m.ReconstructionModule) },
    { path: 'revaluation', loadChildren: () => import('./pages/revaluation/revaluation.module').then(m => m.RevaluationModule) },
    { path: 'acquisition-operation-of-fixed-assets', loadChildren: () => import('./pages/acquisition-operation-calculators/acquisition-operation-calculators.module').then(m => m.AcquisitionOperationOfFixedAssetsModule) },
    { path: 'add-hm-type', loadChildren: () => import('./pages/add-hm-type/add-hm-type.module').then(m => m.AddHmTypeModule) },
    { path: 'add-hm-type/:id', loadChildren: () => import('./pages/add-hm-type/add-hm-type.module').then(m => m.AddHmTypeModule) },

    // { path: '', lo }
];

@NgModule({
    imports: [RouterModule.forChild(fixedAssetsRoutes)],
    exports: [RouterModule]
})

export class FixedAssetsRoutingModule { }

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SalaryView } from './salary.view';
let salaryRoutes: Routes = [
    { path: '', component: SalaryView },
    { path: 'subdivision', loadChildren: () => import('./pages/salary-units/salary-units.module').then(m => m.SalaryUnitsModule) },
    { path: 'position', loadChildren: () => import('./pages/position/position.module').then(m => m.PositionModule) },
    { path: 'profession', loadChildren: () => import('./pages/profession/profession.module').then(m => m.ProfessionModule) },
    { path: 'addition', loadChildren: () => import('./pages/addition/addition.module').then(m => m.AdditionModule) },
    { path: 'employees', loadChildren: () => import('./pages/salary-employee/salary-employee.module').then(m => m.SalaryEmployeeModule) },
    { path: 'payment-from-current-account', loadChildren: () => import('./pages/payment-from-current-account/payment-from-current-account.module').then(m => m.PaymentFromCurrentAccountModule) },
    { path: 'calculation-benefits', loadChildren: () => import('./pages/calculation-benefits/calculation-benefits.module').then(m => m.CalculationBenefitsModule) },
    { path: 'calculation-vacation-time', loadChildren: () => import('./pages/calculation-vacation-time/calculation-vacation-time.module').then(m => m.CalculationVacationTimeModule) },
    { path: 'absent', loadChildren: () => import('./pages/absent/absent.module').then(m => m.AbsentModule) },
    { path: 'hold', loadChildren: () => import('./pages/hold/hold.module').then(m => m.HoldModule) },
    { path: 'calculate-employees-salary', loadChildren: () => import('./pages/employees-salary/employees-salary.module').then(m => m.EmployeesSalaryModule) },
    { path: 'assign-position', loadChildren: () => import('./pages/assign-position/assign-position.module').then(m => m.AssignPositionModule) },
    { path: 'replacements', loadChildren: () => import('./pages/replacements/replacements.module').then(m => m.ReplacementsModule) },
    // { path: 'provisions', loadChildren: () => import('./pages/provisions/provisions.module').then(m => m.ProvisionsModule) },
    { path: 'provisions', loadChildren: () => import('./pages/provision-salary/provision-salary.module').then(m => m.ProvisionSalaryModule) },
    { path: 'system-addition', loadChildren: () => import('./pages/system-addition/system-addition.module').then( m => m.SystemAdditionModule) },
    { path: 'final-calculations', loadChildren: () => import('./pages/final-calculations/final-calculations.module').then(m => m.FinalCalculationsModule) },
    { path: 'salaries-list', loadChildren: () => import('./pages/salaries-list/salaries-list.module').then(m => m.SalariesListModule) },
    { path: 'salaries-list/:id', loadChildren: () => import('./pages/salaries-list/each-salary/each-salary.module').then(m => m.EachSalaryModule) },

]
@NgModule({
    imports: [RouterModule.forChild(salaryRoutes)],
    exports: [RouterModule]
})
export class SalaryRoutingModule { }
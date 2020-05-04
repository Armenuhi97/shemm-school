import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvisionSalaryComponent } from './provision-salary.component';

const provisionSalaryRoutes: Routes = [
    { path: '', component: ProvisionSalaryComponent }
]

@NgModule({
    imports: [RouterModule.forChild(provisionSalaryRoutes)],
    exports: [RouterModule]
})

export class ProvisionSalaryRoutingModule { }
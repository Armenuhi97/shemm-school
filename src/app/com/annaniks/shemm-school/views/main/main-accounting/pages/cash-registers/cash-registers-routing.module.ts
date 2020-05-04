import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashRegistersComponent } from './cash-registers.component';

const cashRegistrationRoutes: Routes = [
    { path: '', component: CashRegistersComponent }
]

@NgModule({
    imports: [RouterModule.forChild(cashRegistrationRoutes)],
    exports: [RouterModule]
})

export class CashRegistrationRoutingModule  {}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { CurrencyView } from './currency.view';
let currencyRoutes: Routes = [{ path: '', component: CurrencyView }]
@NgModule({
    imports: [RouterModule.forChild(currencyRoutes)],
    exports: [RouterModule]
})
export class CurrencyRoutingModule { }
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceOfServicesView } from './price-of-services.view';

const priceOfServicesRoutes: Routes = [
    {path: '', component: PriceOfServicesView}
];

@NgModule({
    imports: [RouterModule.forChild(priceOfServicesRoutes)],
    exports: [RouterModule]
})
export class PriceOfServicesRoutingModule {  }
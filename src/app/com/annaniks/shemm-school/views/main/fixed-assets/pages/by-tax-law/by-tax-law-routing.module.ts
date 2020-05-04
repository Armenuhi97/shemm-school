import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { ByTaxLawView } from './by-tax-law.view';

const byTaxLawRoutes: Routes = [{ path: '', component: ByTaxLawView }]

@NgModule({
    imports: [RouterModule.forChild(byTaxLawRoutes)],
    exports: [RouterModule]
})

export class ByTaxLawRoutingModule { }
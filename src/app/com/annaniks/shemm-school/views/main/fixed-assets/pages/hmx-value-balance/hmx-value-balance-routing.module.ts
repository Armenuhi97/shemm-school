import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { HmxValueBalanceView } from './hmx-value-balance.view';

const hmxValueBalanRoutes: Routes = [{ path: '', component: HmxValueBalanceView }]

@NgModule({
    imports: [RouterModule.forChild(hmxValueBalanRoutes)],
    exports: [RouterModule]
})

export class HmxValueBalanceRoutingModule { } 
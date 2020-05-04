import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HoldView } from './hold.view';

const holdRouter: Routes = [
    { path: '', component: HoldView }
] 

@NgModule({
    imports: [RouterModule.forChild(holdRouter)],
    exports: [RouterModule]
})

export class HoldRoutingModule {}
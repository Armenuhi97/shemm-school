import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemAdditionView } from './system-addition.view';

const systemAdditionRoute: Routes = [
    { path: '', component: SystemAdditionView }
]

@NgModule({
    imports: [RouterModule.forChild(systemAdditionRoute)],
    exports: [RouterModule]
})
export class SystemAdditionRoutingModule { }